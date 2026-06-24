"use client";

const skills = [
  "短视频航线 / Short video route",
  "海报星图 / Poster map",
  "图生视频 / Image to video",
  "角色锁定 / Character lock",
  "商品广告 / Product ad",
  "分镜脚本 / Storyboard",
  "AI 抠图 / AI cutout",
  "风格迁移 / Style transfer"
];

export function SkillChips({ onPick }: { onPick: (skill: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <button
          key={skill}
          onClick={() => onPick(skill)}
          className="rounded-full border border-cyan-100/10 bg-white/6 px-3 py-1.5 text-xs text-white/68 transition hover:border-cyan-300/30 hover:text-cyan-50"
        >
          {skill}
        </button>
      ))}
    </div>
  );
}
