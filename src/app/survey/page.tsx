"use client";
import React,{ useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useUserStore } from "../../store/useUserStore";

const QUESTIONS = [
  {
    id: "available_time",
    question: "하루에 부업에 투자할 수 있는 시간은 어느 정도인가요?",
    options: ["1시간 미만", "1~3시간", "3시간 이상"],
  },
  {
    id: "preferred_reward",
    question: "선호하는 보상 형태는 무엇인가요?",
    options: ["현금/상품권", "금", "코인"],
  },
  {
    id: "personality",
    question: "자신의 성향은 어느 쪽에 가까운가요?",
    options: ["사람들과 소통하는게 좋다", "혼자 조용히 하는게 좋다"],
  },
  {
    id: "pc_ownership",
    question: "보유하고 있는 장비는 무엇인가요?",
    options: ["스마트폰만 있음", "PC/노트북 있음"],
  },
  {
    id: "interests",
    question: "관심 있는 분야를 선택해주세요.",
    options: ["쇼핑/리뷰", "단순 클릭", "데이터 작업", "콘텐츠 제작"],
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const setPersonality = useUserStore((state) => state.setPersonality);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleOptionClick = (option: string) => {
    const currentQuestion = QUESTIONS[step];
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push("/auth/login"); // 로그인 페이지 경로 가정
        return;
      }

      // profiles 테이블의 personality_type 컬럼 업데이트
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ personality_type: finalAnswers })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 전역 상태 업데이트
      setPersonality(finalAnswers);
      
      alert("설문이 완료되었습니다! 대시보드로 이동합니다.");
      router.push("/"); // 메인 대시보드 경로 (루트로 가정)
    } catch (error: any) {
      console.error("Error saving survey:", error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-blue-600 tracking-wider">
            STEP {step + 1} OF {QUESTIONS.length}
          </span>
          <span className="text-sm font-medium text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Area */}
        <div className="mb-10 min-h-[100px]">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            {currentQuestion.question}
          </h1>
          <p className="text-gray-500 text-sm">가장 적절한 답변 하나를 선택해주세요.</p>
        </div>

        {/* Options Area */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={loading}
              className="w-full group p-5 text-left bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 group-hover:text-blue-700 font-semibold text-lg transition-colors">
                  {option}
                </span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                   <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer / Navigation */}
        <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-gray-400 hover:text-gray-600 font-medium flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전으로
            </button>
          ) : (
            <div />
          )}
          
          <p className="text-xs text-gray-300 font-medium italic">
            Buja Project Survey
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-600 font-bold">결과를 저장하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>
  );
}

