import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">부자 프로젝트에 오신 것을 환영합니다</h1>
      <Link 
        href="/survey" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        설문 시작하기
      </Link>
    </div>
  );
}

