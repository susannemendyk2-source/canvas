package com.polaris.asset.service;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MinioService {

    private static final Logger log = LoggerFactory.getLogger(MinioService.class);

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.public-endpoint:${minio.endpoint}}")
    private String publicEndpoint;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket}")
    private String bucket;

    private MinioClient minioClient;

    @PostConstruct
    public void init() {
        try {
            minioClient = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();
            createBucketIfNotExists();
        } catch (Exception e) {
            log.warn("MinIO not available, file upload will fail: {}", e.getMessage());
            minioClient = null;
        }
    }

    public void createBucketIfNotExists() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            log.warn("MinIO createBucketIfNotExists failed: {}", e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file, String objectName) {
        if (minioClient == null) {
            throw new RuntimeException("MinIO not configured, cannot upload file");
        }
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
            return getFileUrl(objectName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO", e);
        }
    }

    public void deleteFile(String objectName) {
        if (minioClient == null) return;
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from MinIO", e);
        }
    }

    public String generatePresignedUrl(String objectName, int expirySeconds) {
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .method(Method.GET)
                    .expiry(expirySeconds, TimeUnit.SECONDS)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    public String getFileUrl(String objectName) {
        String base = publicEndpoint != null && !publicEndpoint.isBlank() ? publicEndpoint : endpoint;
        return base.replaceAll("/+$", "") + "/" + bucket + "/" + objectName;
    }
}
