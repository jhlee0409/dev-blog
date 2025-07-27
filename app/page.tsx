import { BlogPosts } from "app/components/posts";
import VisitorCounter from "@/src/shared/ui/VisitorCounter";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">About Me</h1>
      <p className="mb-4">
        {`안녕하세요! 프론트엔드 엔지니어 이재혁 입니다.
        사용자 관점에서 서비스를 이해하고 빠르게 개선하며,
        새로운 기술을 적극적으로 탐색하고 도입해왔습니다.
        다양한 직군과의 협업 경험을 통해 원활한 소통과 시너지 창출에 강점이 있으며,
        함께 성장하는 것을 추구하고 있습니다`}
      </p>

      {/* 방문자 수 표시 */}
      {/* <div className="my-6">
        <VisitorCounter variant="compact" className="justify-center" />
      </div> */}

      <div className="my-8">
        <p className="mb-2 text-xl font-semibold tracking-tighter">
          📕 Latest Posts
        </p>
        <BlogPosts />
      </div>
    </section>
  );
}
