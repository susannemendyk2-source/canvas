
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `polaris` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `polaris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_provider_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `provider` varchar(30) NOT NULL,
  `base_url` varchar(500) DEFAULT NULL,
  `api_key_enc` varchar(1000) DEFAULT NULL,
  `secret_key_enc` varchar(1000) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_provider` (`user_id`,`provider`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `ai_provider_config` VALUES (1,2,'deepseek','https://api.deepseek.com','REDACTED',NULL,'deepseek-v4-flash',1,'2026-06-23 19:23:30','2026-06-23 19:38:23'),(2,2,'jimeng','https://ark.cn-beijing.volces.com/api/v3/images/generations','REDACTED',NULL,'doubao-seedream-5-0-260128',1,'2026-06-23 19:23:59','2026-06-24 06:05:28'),(3,2,'volc','','REDACTED',NULL,'volc-engine',1,'2026-06-23 20:01:18','2026-06-23 20:03:13'),(4,2,'chat','','REDACTED',NULL,'',1,'2026-06-24 00:02:41','2026-06-24 00:51:08'),(5,2,'image-volcengine-jimeng','','REDACTED','REDACTED','',1,'2026-06-24 00:02:43','2026-06-24 12:36:56'),(6,2,'jimeng-4','https://ark.cn-beijing.volces.com/api/v3/images/generations','REDACTED',NULL,'doubao-seedream-4-0-250828',1,'2026-06-24 07:18:31','2026-06-24 07:18:31'),(7,2,'video-default','https://ark.cn-beijing.volces.com/api/v3','REDACTED',NULL,'doubao-seedance-2-0-260128',1,'2026-06-24 09:24:31','2026-06-24 09:24:31'),(8,1,'chat','','REDACTED',NULL,'',1,'2026-06-29 11:24:31','2026-06-29 11:24:31');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `file_key` varchar(500) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `size` bigint DEFAULT '0',
  `mime_type` varchar(100) DEFAULT NULL,
  `favorite` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canvas_object` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `position_x` double DEFAULT '0',
  `position_y` double DEFAULT '0',
  `width` double DEFAULT '320',
  `height` double DEFAULT '220',
  `meta` json DEFAULT NULL,
  `sort` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `canvas_object` VALUES (1,1,'prompt','Prompt 提示词航点','你好\n\nPrompt recipe\n',50.666656494140625,82.40003967285156,320,220,NULL,0,'2026-06-22 23:09:55','2026-06-25 22:53:09'),(29,1,'image','Image waypoint','Describe image generation or editing instructions.',592.0602718619414,77.43606248012816,600,430,NULL,0,'2026-06-23 13:48:33','2026-06-25 22:53:09'),(32,1,'video','Video waypoint','Describe scene, camera motion, duration and references.',-56.04660318064134,889.6155258888423,600,430,NULL,0,'2026-06-23 14:05:28','2026-06-25 22:53:09'),(33,2,'prompt','Updated Card','Hello World',150,250,360,220,NULL,0,'2026-06-23 14:27:41','2026-06-23 14:27:48'),(43,3,'video','Image to Video','12s vertical motion draft.',1020,380,420,300,NULL,0,'2026-06-23 15:33:38','2026-06-23 15:33:59'),(44,3,'image','Image Generate','Generate key first frame and references.',560,330,380,260,NULL,0,'2026-06-23 15:33:38','2026-06-23 15:33:59'),(45,3,'prompt','Creative Prompt','Four hero frame candidates.',120,260,360,220,NULL,0,'2026-06-23 15:33:38','2026-06-23 15:33:59'),(46,5,'prompt','Prompt waypoint','铁甲小宝大战哥斯拉',695.2930922397347,220.61395547556322,360,220,NULL,0,'2026-06-23 15:43:44','2026-06-23 16:20:25'),(47,5,'generated','生成资产 / Generated asset','Polaris mock result added near your current route.',220,200,420,260,NULL,0,'2026-06-23 15:44:40','2026-06-23 16:20:25'),(48,6,'prompt','Prompt waypoint','New creative asset ready for refinement.',772.0930800327035,455.81396768259447,360,220,NULL,0,'2026-06-23 16:27:17','2026-06-23 16:27:19'),(49,7,'image','Image Generate','Generate key first frame and references.',560,330,380,260,NULL,0,'2026-06-23 16:27:30','2026-06-23 16:27:30'),(50,9,'prompt','Creative Prompt','Error: 401 Authorization Required on POST request for \"https://api.deepseek.com/chat/completions\": [no body]',120,260,360,220,NULL,0,'2026-06-23 16:27:30','2026-06-23 16:33:22'),(51,8,'video','Image to Video','12s vertical motion draft.',1020,380,420,300,NULL,0,'2026-06-23 16:27:30','2026-06-23 16:27:30'),(69,10,'image','图像生成','阳光透过斑驳的树影，洒在一座老旧的农家小院里。青砖灰瓦的矮房前，一位老农蹲在石阶上，手里捧着一碗热茶，眼神悠闲地望着远处金黄的麦田。院子角落里，几只母鸡低头啄食，旁边一只橘猫懒洋洋地趴在石磨上打盹。微风拂过，带来泥土与野花的清香。画面整体色调温暖饱和，光线柔和自然，风格偏向写实乡村油画，略带一点复古胶片的颗粒感。比例16:9，镜头视角稳定平视，景深适中，远处田野略有虚化。整体营造出一种宁静、怀旧、慢节奏的田园生活氛围。',557.86669921875,23.86664581298828,380,260,'{\"generatedUrl\": \"https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-0/0217822984560297904abb9448890f9b94c80482cf61b29a1fc1e_0.jpeg?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=REDACTED_ACCESS_KEY_ID%2F20260624%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20260624T105422Z&X-Tos-Expires=86400&X-Tos-Signature=fefd568b8ec5c862782ee8f0e622520c55fa6c24f2be981412a25394f91145d2&X-Tos-SignedHeaders=host\"}',0,'2026-06-24 18:53:47','2026-06-25 15:32:11'),(70,10,'prompt','创意 Prompt','阳光透过斑驳的树影，洒在一座老旧的农家小院里。青砖灰瓦的矮房前，一位老农蹲在石阶上，手里捧着一碗热茶，眼神悠闲地望着远处金黄的麦田。院子角落里，几只母鸡低头啄食，旁边一只橘猫懒洋洋地趴在石磨上打盹。微风拂过，带来泥土与野花的清香。画面整体色调温暖饱和，光线柔和自然，风格偏向写实乡村油画，略带一点复古胶片的颗粒感。比例16:9，镜头视角稳定平视，景深适中，远处田野略有虚化。整体营造出一种宁静、怀旧、慢节奏的田园生活氛围。',120,260,360,220,NULL,0,'2026-06-24 18:53:47','2026-06-25 15:32:11'),(73,10,'video','视频节点','描述场景、镜头运动、时长和参考素材。',1027.472786836846,61.98136192144352,600,430,'{\"prompt\": \"描述场景、镜头运动、时长和参考素材。\", \"taskId\": \"cgt-20260624223721-qtfb5\", \"polledAt\": 1782311844474, \"startedAt\": 1782311842342, \"taskStatus\": \"running\", \"generatedUrl\": \"https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178230400230500000000000000000000ffffac1415b0285672.mp4?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=REDACTED_ACCESS_KEY_ID%2F20260624%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20260624T122919Z&X-Tos-Expires=86400&X-Tos-Signature=4584ffdda104dab4a40d3b52552916e6c570028480b08ea666048e7319591f57&X-Tos-SignedHeaders=host\"}',0,'2026-06-24 20:14:28','2026-06-25 15:32:11'),(89,13,'prompt','创意 Prompt','四个主视觉候选画面。',120,260,360,220,NULL,0,'2026-06-25 15:32:22','2026-06-25 19:47:10'),(90,13,'video','图生视频','12 秒竖屏动态草稿。',1020,380,420,300,NULL,0,'2026-06-25 15:32:22','2026-06-25 19:47:10'),(91,13,'image','图像生成','四个主视觉候选画面。',560,330,380,260,NULL,0,'2026-06-25 15:32:22','2026-06-25 19:47:10'),(93,13,'prompt','AI Prompt','好的，这是为您拆解的运动手表视频生成方案：\n\n1.  **简短创意摘要**\n    一段充满活力与动感的运动手表视频，旨在突出手表的坚固耐用、功能全面以及佩戴者在高强度运动中的专业感。\n\n2.  **正向提示词**\n    动态、特写、第一人称视角、运动手表、户外、跑步、骑行、高清、慢动作、汗水、阳光、金属质感、表盘界面、心率显示、GPS轨迹、背光、防水、溅水、马拉松、山地车、极限运动、节奏感、活力、激励、专业、科技、未来感、商业广告级别、电影级调色、景深效果。\n\n3.  **负向提示词**\n    静态、模糊、低分辨率、手抖、室内、普通表、损坏、划痕、黑暗、陈旧、卡通、动漫、低俗、性感、色情、暴力、恐怖、丑陋、变形、文字、水印、图形叠加。\n\n4.  **推荐节点链路**\n    *   **场景生成**: `Text to Video` (生成核心运动场景，如跑步、骑行)\n    *   **风格迁移**: `Style Transfer` (应用电影级调色与质感)\n    *   **物体/局部重绘**: `Inpainting` (特写手表表盘，精修细节，如屏幕显示内容)\n    *   **人物与背景分离**: `Background Remover` (将运动人物/手表与背景分离)\n    *   **动态序列**: `AnimateDiff` / `Motion Brush` (为静态背景添加动态效果，如风吹草动、云彩流动)\n    *   **循环**: `Loop / Loopback` (生成无限循环的慢动作特写)\n    *   **放大与增强**: `Upscale` (提升分辨率至4K或更高)\n\n5.  **图像/视频比例与风格建议**\n    *   **比例**: 16:9 (宽银幕电影感，适合展示运动场景)\n    *   **风格**: **写实电影风格 (Realistic Cinematic)**\n        *   **色彩**: 高对比度、暖色调(金黄的阳光/夕阳)、或冷色调(清晨/阴天)配合鲜艳的表盘色彩。\n        *   **光影**: 强烈的侧光或逆光，突出手表的金属与玻璃质感，汗珠反光。\n        *   **景深**: 浅景深，焦点锁定在手表表盘上，背景虚化。\n        *   **运动模糊**: 在非慢动作段落加入径向或方向运动模糊，增强速度感。',200,200,320,220,NULL,0,'2026-06-25 15:52:06','2026-06-25 15:52:06'),(94,1,'prompt','AI Prompt','Error: API key not configured. Please save your Chat API settings.',200,200,320,220,NULL,0,'2026-06-25 20:30:33','2026-06-25 22:53:09'),(95,1,'image','图像节点','描述图像生成或编辑要求。',372,252,600,430,NULL,0,'2026-06-25 22:53:02','2026-06-25 22:53:09'),(96,1,'prompt','Copilot 建议','已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。',340,250,420,260,NULL,0,'2026-06-25 22:53:04','2026-06-25 22:53:09'),(97,1,'prompt','Copilot 建议','已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。',180,160,420,260,NULL,0,'2026-06-25 22:53:09','2026-06-25 22:53:09'),(98,1,'video','视频渲染','把首帧转成动态视频。',1120,280,420,300,NULL,0,'2026-06-25 22:53:09','2026-06-25 22:53:09'),(99,1,'image','首帧','已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。',650,220,420,280,NULL,0,'2026-06-25 22:53:09','2026-06-25 22:53:09'),(100,1,'prompt','Copilot 建议','已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。',436,322,420,260,NULL,0,'2026-06-25 22:53:12','2026-06-25 22:53:12'),(101,1,'prompt','Copilot 建议','已添加图像节点。它可以接收 Prompt，并继续输入到视频生成。',220,160,420,260,NULL,0,'2026-06-25 22:54:02','2026-06-25 22:58:42'),(102,1,'prompt','Prompt 节点','新的创意资产，可继续细化。',633.4883720930233,248.13953044802645,360,220,NULL,0,'2026-06-25 22:54:40','2026-06-25 22:58:42'),(103,1,'moodboard','分镜','镜头 01-06 和视觉方向。',1384.9611646075582,381.7829957119254,420,280,NULL,0,'2026-06-25 22:58:40','2026-06-25 22:58:42'),(104,14,'prompt','创意 Prompt','四个主视觉候选画面。',120,260,360,220,NULL,0,'2026-06-25 23:13:14','2026-06-25 23:13:33'),(105,15,'video','图生视频','12 秒竖屏动态草稿。',846.1333312988281,168.79998779296875,420,300,NULL,0,'2026-06-25 23:13:14','2026-06-29 11:37:54'),(106,16,'image','图像生成','四个主视觉候选画面。',560,330,380,260,NULL,0,'2026-06-25 23:13:14','2026-06-25 23:13:33'),(107,15,'image','图像节点','描述图像生成或编辑要求。',1383.9193242982374,237.66812790271842,600,430,NULL,0,'2026-06-25 23:13:27','2026-06-29 11:37:54'),(108,15,'prompt','AI Prompt','悠然乡村生活画卷：阳光明媚的午后，金黄麦田随风起伏，一位农民戴着草帽坐在田埂上休息，身旁趴着一只花猫。远处是青瓦白墙的农舍和袅袅炊烟，绿树成荫，鲜花点缀。画面采用温暖的怀旧色调，柔和的自然光线，中景构图，细腻的水彩风格，细节丰富，宁静祥和的氛围。',200,200,320,220,NULL,0,'2026-06-29 11:25:03','2026-06-29 11:37:54'),(109,15,'prompt','AI Prompt','好的，作为Polaris AI创作系统的创意架构师，我将为您把“机甲打斗”这一目标拆解为可执行的创意蓝图。\n\n---\n\n**1. 简短创意摘要**\n\n一台名为“铁幕”的旧式量产机甲，在反乌托邦的锈蚀废城中，为保护最后一批平民撤离，与三台更先进、更迅捷的“幽灵”猎杀机甲展开不对称的游击战，最终以自毁引擎的方式同归于尽，为希望赢得一线生机。\n\n**2. 正向提示词**\n\n*   **场景与氛围:** 末日废土、赛博朋克、暴雨黄昏、霓虹灯下、锈蚀金属、飞扬尘土、爆炸火花。\n*   **角色与动作:** 老旧机甲 (风格：笨重、伤痕累累、焊接痕迹)、敌方机甲 (风格：流体线条、隐形迷彩、致命优雅)。 动作：跳跃躲闪、铁拳对轰、近身搏斗 (抓取关节锁死)、能量炮对射、战术翻滚、紧急规避。\n*   **视觉风格:** 电影感、高对比、动态模糊、粒子效果、金属质感、镜头追踪、史诗视角、广角镜头、慢动作。\n\n**3. 负向提示词**\n\n*   （避免喜剧幽默趣味）\n*   （避免卡通化的形象或Q版）\n*   （避免低多边形或模糊的渲染）\n*   （避免静态、平淡无奇的光照）\n*   （避免明亮的、柔和的光线，需强化机甲重量感）\n\n**4. 推荐节点链路**\n\n1.  **场景生成节点:** 输入“末日废城”、“暴雨黄昏”、“霓虹灯光”，生成背景。\n2.  **角色设定节点:** 分别生成“铁幕”机甲 (笨重、伤痕) 和“幽灵”机甲 (线条、隐形)。\n3.  **分镜脚本节点:**\n    *   镜头A：俯拍，“铁幕”在废墟中隐蔽，监视探头扫过。\n    *   镜头B：特写，“铁幕”驾驶员紧握操纵杆，关节发出金属哀鸣。\n    *   镜头C：中景，三台“幽灵”在烟雾中浮现，成包围之势。\n    *   镜头D：动态镜头，双方首次交锋，“铁幕”用左臂护盾格挡能量束，火花四溅。\n    *   镜头E：慢动作，“铁幕”抓住一台“幽灵”的头颅，用力砸进地面。\n    *   镜头F：全景，“铁幕”拔下核心能源，冲向剩余两台敌人。\n4.  **渲染与导出节点:** 导入所有分镜，添加电影级光效、粒子特效（雨、火花、爆炸碎片），调整色彩曲线呈冷色调（铁灰）与暖色（爆炸橙）对比。\n\n**5. 图像/视频比例与风格建议**\n\n*   **图像/视频比例:**\n    *   **推荐:** 2.35:1 (超宽银幕比例)，营造标准的电影感史诗画面。\n    *   **可选:** 16:9 (现代标准比例)，适合流媒体平台或游戏过场动画。\n*   **风格建议:**\n    *   **首选: 写实电影油画风**。结合细腻的材质渲染 (如生锈的金属肌理、雨珠在装甲上的流动) 与粗犷的笔触感，增强画面的厚重与张力。\n    *   **备选: 机甲插画风**。强调线条的硬朗与光影的块面感，色彩更饱和，轮廓更分明，适合静态高质量图片输出。\n    *   **动态风格:** 镜头运动模拟手持摄影机的不稳定感，增加身临其境的紧张与混乱。\n\n---\n\n**脚本扩展范例 (为节点链路服务):**\n\n*   **[场景1: 潜伏]**\n    (镜头1) 废城内，暴雨如注。一台漆面剥落的“铁幕”机甲，紧贴断墙，缓慢移动，关节处的液压杆发出刺耳的摩擦声。\n    (镜头2) 空中，三束幽蓝的扫描光束交叉扫过，“铁幕”立刻隐蔽在一块倒塌的巨大广告牌后，屏息以待。\n\n*   **[场景2: 突袭]**\n    (镜头3) 光束尽头的三角阵型中，三台“幽灵”缓缓降落，发出微弱的反光。\n    (镜头4) “铁幕”选择主动出击，从掩体后猛然跃出，右臂能量炮开火，炸开一片废墟，制造混乱。\n\n*   **[场景3: 缠斗]**\n    (镜头5) 双方高速接近，“幽灵”的子弹链在“铁幕”装甲上留下密集的弹孔。 “铁幕”硬抗伤害，直接用左手抓住离得最近的一台“幽灵”的腿，将其砸向另两台。\n    (镜头6) 慢速特写：被砸中的那台“幽灵”颈部断裂，火花从管线中喷溅而出。',200,200,320,220,NULL,0,'2026-06-29 11:28:24','2026-06-29 11:28:24'),(110,17,'prompt','AI Prompt','**Prompt:** 夕阳下的中国乡村田园风光，柔和的金色光线洒落，一条蜿蜒土路穿过稻田，远处炊烟袅袅的红砖农舍，老农牵着黄牛归家，孩童在院中嬉戏。色彩温暖饱和，光影细腻，具有油画般的质感，4K高分辨率，浅景深，电影级构图，宁静祥和的氛围，写实风格，自然的动态细节。',210.6666259765625,210.13330078125,320,220,NULL,0,'2026-06-29 11:38:55','2026-06-29 12:24:19');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `balance` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `credit_account` VALUES (1,1,10000,'2026-06-22 11:25:39','2026-06-22 11:25:39');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `amount` int NOT NULL,
  `balance` int NOT NULL,
  `type` varchar(30) NOT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text,
  `type` varchar(30) DEFAULT 'system',
  `is_read` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` varchar(20) DEFAULT 'api',
  `parent_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `mode` varchar(50) DEFAULT 'magic-canvas',
  `cover` varchar(500) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `is_template` tinyint DEFAULT '0',
  `is_public` tinyint DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `tags` varchar(500) DEFAULT NULL,
  `meta` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `project` VALUES (1,'Polaris Canvas 2026/6/22 23:09:55','Created from Polaris Studio','magic-canvas',NULL,1,0,0,1,NULL,'[]','2026-06-22 23:09:55','2026-06-25 22:58:42'),(2,'Test Canvas','test','magic-canvas',NULL,1,0,0,1,NULL,NULL,'2026-06-23 14:27:36','2026-06-23 14:27:36'),(3,'Polaris Canvas 2026/6/23 14:37:43','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,'[{\"id\":\"link-5-mqqbvj8m\",\"sourceId\":\"45\",\"targetId\":\"44\",\"label\":\"image\"},{\"id\":\"link-6-mqqbvj8m\",\"sourceId\":\"44\",\"targetId\":\"43\",\"label\":\"video\"}]','2026-06-23 14:37:43','2026-06-23 15:33:59'),(5,'Polaris Canvas 2026/6/23 15:43:43','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,'[]','2026-06-23 15:43:44','2026-06-23 16:20:25'),(6,'Polaris Canvas 2026/6/23 16:27:16','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,'[]','2026-06-23 16:27:17','2026-06-23 16:27:19'),(7,'Polaris Canvas 2026/6/23 16:27:29','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,NULL,'2026-06-23 16:27:30','2026-06-23 16:27:30'),(8,'Polaris Canvas 2026/6/23 16:27:29','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,NULL,'2026-06-23 16:27:30','2026-06-23 16:27:30'),(9,'Polaris Canvas 2026/6/23 16:27:29','Created from Polaris Studio','magic-canvas',NULL,3,0,0,1,NULL,NULL,'2026-06-23 16:27:30','2026-06-23 16:27:30'),(10,'Polaris Canvas 2026/6/23 18:40:04','Created from Polaris Studio','magic-canvas',NULL,2,0,0,1,NULL,'[{\"id\":\"link-2-mqsa980b\",\"sourceId\":\"70\",\"targetId\":\"69\"},{\"id\":\"link-3-mqsa9b6m\",\"sourceId\":\"69\",\"targetId\":\"73\"}]','2026-06-23 18:40:05','2026-06-25 15:32:11'),(11,'新画布1','','magic-canvas',NULL,2,0,0,1,NULL,'[]','2026-06-24 22:43:58','2026-06-25 00:13:56'),(12,'新画布','','magic-canvas',NULL,2,0,0,1,NULL,NULL,'2026-06-25 00:13:57','2026-06-25 00:13:57'),(13,'新画布','','magic-canvas',NULL,2,0,0,1,NULL,'[{\"id\":\"link-10-mqt6pl7y\",\"sourceId\":\"89\",\"targetId\":\"91\",\"label\":\"image\"},{\"id\":\"link-11-mqt6pl7y\",\"sourceId\":\"91\",\"targetId\":\"90\",\"label\":\"video\"}]','2026-06-25 15:32:14','2026-06-25 19:47:10'),(14,'Polaris Canvas 2026/6/25 23:13:13','Created from Polaris Studio','magic-canvas',NULL,1,0,0,1,NULL,NULL,'2026-06-25 23:13:14','2026-06-25 23:13:14'),(15,'Polaris Canvas 2026/6/25 23:13:13','Created from Polaris Studio','magic-canvas',NULL,1,0,0,1,NULL,'[{\"id\":\"link-5-mqtn69pa\",\"sourceId\":\"104\",\"targetId\":\"106\",\"label\":\"image\"},{\"id\":\"link-6-mqtn69pa\",\"sourceId\":\"106\",\"targetId\":\"105\",\"label\":\"video\"},{\"id\":\"link-10-mqynx2tg\",\"sourceId\":\"105\",\"targetId\":\"107\"}]','2026-06-25 23:13:14','2026-06-29 11:37:54'),(16,'Polaris Canvas 2026/6/25 23:13:13','Created from Polaris Studio','magic-canvas',NULL,1,0,0,1,NULL,NULL,'2026-06-25 23:13:14','2026-06-25 23:13:14'),(17,'新画布','','magic-canvas',NULL,1,0,0,1,NULL,NULL,'2026-06-29 11:37:59','2026-06-29 11:37:59');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `role` VALUES (1,'User','USER','Regular user','2026-06-22 11:25:39'),(2,'Admin','ADMIN','Administrator','2026-06-22 11:25:39'),(3,'Super Admin','SUPER_ADMIN','Super administrator','2026-06-22 11:25:39');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_perm` (`role_id`,`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `module` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `detail` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `system_log` VALUES (1,'credit','adjust',1,'0:0:0:0:0:0:0:1','用户2积分调整+100','2026-06-25 14:42:10');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `type` tinyint DEFAULT '0',
  `credits` int DEFAULT '0',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `user` VALUES (1,'admin','$2a$10$DtyUGpRSCfqWFta96fSCmeaV9C.GawuBiZsZ7.737flJkHI7JUoUe',NULL,'Super Admin',NULL,NULL,1,0,0,NULL,'2026-06-22 11:25:39','2026-06-22 11:25:39'),(2,'tkq','$2a$10$bc/QxtxcUjHI.z2HU8IJKeHwOscfcEGCQ3Bx7vvT6M4Xhd9kSRDr2','123@qq.com','tkq',NULL,NULL,1,0,100,NULL,'2026-06-23 06:18:48','2026-06-23 06:18:48'),(3,'haley','$2a$10$EfpFwXiJ1tDrzKkW6cOlCeMBIeExIL0cWmidJ8Ki6NXX.likFQwfq','2560210052@qq.com','haley',NULL,NULL,1,0,0,NULL,'2026-06-23 06:31:40','2026-06-23 06:31:40');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
INSERT INTO `user_role` VALUES (1,1,3);
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `name` varchar(100) DEFAULT 'default',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_edge` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `workflow_id` bigint NOT NULL,
  `source_node_id` bigint NOT NULL,
  `target_node_id` bigint NOT NULL,
  `source_handle` varchar(50) DEFAULT NULL,
  `target_handle` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_node` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `workflow_id` bigint NOT NULL,
  `node_type` varchar(30) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `position_x` double DEFAULT '0',
  `position_y` double DEFAULT '0',
  `config` json DEFAULT NULL,
  `status` varchar(30) DEFAULT 'idle',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
