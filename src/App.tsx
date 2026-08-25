import { useState, useEffect, useId } from 'react';
import confetti from 'canvas-confetti';
import { StepId, CheckinResult, PlanData, GoogleSheetConfig, ToastMessage, StressTier } from './types';
import { getSavedConfig, saveLocalCheckin, submitPlanRecord, submitConcernRecord, syncAdminPinFromRemote, applyUrlConfigParams } from './services/googleSheets';
import { Header } from './components/Header';
import { StepIntro } from './components/StepIntro';
import { Step1Learn } from './components/Step1Learn';
import { Step2Diagnosis } from './components/Step2Diagnosis';
import { Step3Examine } from './components/Step3Examine';
import { Step4Experience } from './components/Step4Experience';
import { Step5Plan } from './components/Step5Plan';
import { Step6Complete } from './components/Step6Complete';
import { ClassBoardView } from './components/ClassBoardView';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ClassQrModal } from './components/ClassQrModal';
import { Toast } from './components/Toast';
import { ChevronLeft } from 'lucide-react';

export default function App() {
  const generatedId = useId();
  // 1. 네비게이션 및 모드 상태
  const [currentStep, setCurrentStep] = useState<StepId>(0);
  const [isBoardView, setIsBoardView] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [config, setConfig] = useState<GoogleSheetConfig>(getSavedConfig());

  // 1인 1줄 구글 시트 통합 관리를 위한 고유 세션 식별자
  const [sessionId, setSessionId] = useState<string>(
    () => 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
  );

  // 관리자 인증 모달 상태
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [adminAuthTarget, setAdminAuthTarget] = useState<'board' | 'sheet' | 'boguni' | null>(null);

  // 2. 자가진단 상태 (STEP 2)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);

  // 3. 스트레스 요인 상태 (STEP 3)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [situationText, setSituationText] = useState('');
  const [studentNickname, setStudentNickname] = useState('');

  // 4. 관리법 체험 상태 (STEP 4)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  // 5. 실천 계획 다짐 상태 (STEP 5)
  const [plan, setPlan] = useState<PlanData>({
    id: `plan-${Date.now()}`,
    method: '',
    reason: '',
    when: '',
    how: '',
    expect: '',
    cheer: '',
    studentName: '',
    gradeClass: '',
    createdAt: new Date().toISOString(),
  });
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [hasSubmittedPlan, setHasSubmittedPlan] = useState(false);

  // 6. 토스트 알림 상태
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // 관리자 인증 요청 트리거 (비밀번호 확인 후 전자칠판 또는 구글 시트 모달 진입 또는 보거니 확인)
  const handleOpenAdminProtected = (target: 'board' | 'sheet' | 'boguni') => {
    setAdminAuthTarget(target);
    setIsAdminAuthOpen(true);
  };

  const handleAdminAuthSuccess = () => {
    const target = adminAuthTarget;
    setIsAdminAuthOpen(false);
    setAdminAuthTarget(null);
    if (target === 'board') {
      setIsBoardView(true);
      showToast('전자칠판 관리자 모드로 접속했습니다 🌿');
    } else if (target === 'sheet') {
      setIsSheetModalOpen(true);
      showToast('구글 시트 연동 설정창이 열렸습니다 📊');
    } else if (target === 'boguni') {
      setCurrentStep(6);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
      });
      showToast('🎁 보거니 관리자 확인 완료! 상품을 수령하세요!', 'success');
    }
  };

  // URL 쿼리 파라미터 확인 및 원격 PIN & 설정 동기화
  useEffect(() => {
    applyUrlConfigParams();
    const latestConfig = getSavedConfig();
    setConfig(latestConfig);

    const params = new URLSearchParams(window.location.search);
    if (params.get('board') === '1') {
      setIsBoardView(true);
    }
    // 다른 기기나 브라우저에서 변경된 최신 PIN이 있다면 동기화 수신
    syncAdminPinFromRemote();
  }, []);

  // STEP 2 퀴즈 문항 선택 처리
  const handleSelectQuizOption = (qIndex: number, score: number) => {
    const nextAnswers = [...quizAnswers];
    nextAnswers[qIndex] = score;
    setQuizAnswers(nextAnswers);

    if (nextAnswers.every((a) => a !== null)) {
      const totalScore = (nextAnswers as number[]).reduce((a, b) => a + b, 0);
      let tier: StressTier = '낮음';
      if (totalScore <= 4) tier = '낮음';
      else if (totalScore <= 9) tier = '보통';
      else if (totalScore <= 12) tier = '높음';
      else tier = '매우 높음';

      const result: CheckinResult = {
        score: totalScore,
        tier,
        answers: nextAnswers,
        testedAt: new Date().toISOString(),
      };
      setCheckinResult(result);

      // 자가진단 결과 로컬 저장 (시트에는 미완성 행이 남지 않고 STEP 3/5에서 1인 1줄로 통합 전송)
      saveLocalCheckin(result);
    }
  };

  // STEP 3 카테고리 토글
  const handleToggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  // STEP 3 고민을 전자칠판 및 구글 시트에 저장
  const handleSaveConcernToBoard = async (): Promise<boolean> => {
    try {
      const res = await submitConcernRecord(
        studentNickname || plan.studentName || '익명 친구',
        selectedCategories,
        situationText,
        checkinResult,
        sessionId
      );
      if (res.isRemote) {
        showToast('🌿 구글 시트와 우리 반 전자칠판에 마음을 등록했어요!');
      } else {
        showToast('🌿 우리 반 전자칠판 [고민 나누기]에 등록되었어요!');
      }
      return true;
    } catch (e) {
      console.error('Save concern error:', e);
      showToast('고민 저장에 실패했습니다. 다시 시도해주세요.', 'error');
      return false;
    }
  };

  // STEP 4 힐링 방법 토글
  const handleToggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  // STEP 5 계획 입력값 변경
  const handleChangePlan = (field: keyof PlanData, val: string) => {
    setPlan((prev) => ({ ...prev, [field]: val }));
    if (field === 'studentName' && !studentNickname) {
      setStudentNickname(val);
    }
  };

  // STEP 5 종이비행기 날리기 (구글 시트 & 로컬 전송: 1인 1행 통합 전송)
  const handleSubmitPlan = async () => {
    setIsSubmittingPlan(true);
    try {
      const planToSave: PlanData = {
        ...plan,
        studentName: plan.studentName || studentNickname || '익명',
        createdAt: new Date().toLocaleString(),
        gradeClass: config.className,
      };

      const res = await submitPlanRecord(
        planToSave,
        checkinResult,
        selectedCategories,
        situationText,
        sessionId
      );

      setHasSubmittedPlan(true);
      if (res.isRemote) {
        showToast('✈️ 구글 시트와 우리 반 하늘에 종이비행기를 날렸어요! (1줄 기록 완료)');
      } else {
        showToast('✈️ 마음을 띄워보냈어요! (로컬 및 반 게시판 저장 완료)');
      }
    } catch (e) {
      showToast('다짐 저장에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  // 다시 처음부터 시작하기
  const handleRestart = () => {
    setCurrentStep(0);
    setQuizAnswers([null, null, null, null, null]);
    setCheckinResult(null);
    setSelectedCategories([]);
    setSituationText('');
    setStudentNickname('');
    setSelectedMethods([]);
    setSessionId('session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
    setPlan({
      id: `plan-${Date.now()}-${generatedId}`,
      method: '',
      reason: '',
      when: '',
      how: '',
      expect: '',
      cheer: '',
      studentName: '',
      gradeClass: config.className,
      createdAt: new Date().toISOString(),
    });
    setHasSubmittedPlan(false);
    showToast('새로운 마음 쉼표를 시작합니다 🌱');
  };

  // 전자칠판 단독 모드 렌더링
  if (isBoardView) {
    return (
      <ClassBoardView
        config={config}
        onClose={() => setIsBoardView(false)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onShowToast={showToast}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 헤더 */}
      <Header
        currentStep={currentStep}
        totalSteps={7}
        config={config}
        onOpenSheetModal={() => handleOpenAdminProtected('sheet')}
        onOpenBoardView={() => handleOpenAdminProtected('board')}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onSelectStep={(s) => setCurrentStep(s)}
      />

      {/* 메인 스텝 콘텐츠 영역 */}
      <main className="flex-1 pb-16 pt-2">
        {/* 상단 이전 단계 네비게이션 (스텝 0 제외) */}
        {currentStep > 0 && (
          <div className="max-w-xl mx-auto px-3 sm:px-4 pt-1 pb-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((s) => (s > 0 ? ((s - 1) as StepId) : s))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="이전 단계로 돌아가기"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
              <span>이전 단계로</span>
            </button>
            <span className="text-[11px] font-medium text-slate-400">
              {currentStep === 6 ? '🎉 완료 리포트' : `${currentStep} / 6 단계`}
            </span>
          </div>
        )}

        {currentStep === 0 && (
          <StepIntro
            config={config}
            onStart={() => setCurrentStep(1)}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        )}

        {currentStep === 1 && (
          <Step1Learn onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <Step2Diagnosis
            answers={quizAnswers}
            onSelectOption={handleSelectQuizOption}
            result={checkinResult}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3Examine
            selectedCategories={selectedCategories}
            situationText={situationText}
            studentName={studentNickname || plan.studentName}
            onToggleCategory={handleToggleCategory}
            onChangeSituation={setSituationText}
            onChangeStudentName={(name) => {
              setStudentNickname(name);
              setPlan((prev) => ({ ...prev, studentName: name }));
            }}
            onSaveConcernToBoard={handleSaveConcernToBoard}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4Experience
            selectedMethods={selectedMethods}
            onToggleMethod={handleToggleMethod}
            onNext={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <Step5Plan
            plan={plan}
            onChangePlan={handleChangePlan}
            onSubmitPlan={handleSubmitPlan}
            onNext={() => handleOpenAdminProtected('boguni')}
            isSubmitting={isSubmittingPlan}
            hasSubmitted={hasSubmittedPlan}
          />
        )}

        {currentStep === 6 && (
          <Step6Complete
            checkin={checkinResult}
            selectedCategories={selectedCategories}
            situationText={situationText}
            selectedMethods={selectedMethods}
            plan={plan}
            schoolName={config.schoolName}
            className={config.className}
            onRestart={handleRestart}
            onOpenBoardView={() => handleOpenAdminProtected('board')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* 관리자 비밀번호 확인 모달 */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => {
          setIsAdminAuthOpen(false);
          setAdminAuthTarget(null);
        }}
        onSuccess={handleAdminAuthSuccess}
        targetTitle={
          adminAuthTarget === 'boguni'
            ? '보거니 관리자 확인 (상품 수령 🎁)'
            : adminAuthTarget === 'board'
            ? '전자칠판 게시판 접속'
            : '구글 시트 연동 설정'
        }
        targetDescription={
          adminAuthTarget === 'boguni'
            ? '보거니 관리자(보건 선생님/진행자)가 학생의 실천 다짐 화면을 확인한 후 관리자 암호를 입력해주세요. 멋진 선물과 함께 완료 리포트 단계로 이동합니다.'
            : adminAuthTarget === 'board'
            ? '학급 전자칠판(전체 학생 현황)은 교사용 관리자 비밀번호 입력 후 이용할 수 있습니다.'
            : '구글 스프레드시트 연동 및 웹앱 URL 설정은 관리자 권한이 필요합니다.'
        }
        badgeText={
          adminAuthTarget === 'boguni'
            ? '보거니 관리자 확인 · 상품 증정'
            : '교사 / 진행자 권한 확인'
        }
        confirmBtnText={
          adminAuthTarget === 'boguni' ? '확인 완료 & 선물 증정' : '인증 및 열기'
        }
        isBoguniMode={adminAuthTarget === 'boguni'}
      />

      {/* 구글 시트 연동 설정 모달 */}
      <GoogleSheetModal
        config={config}
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        onSaveConfig={(newCfg) => setConfig(newCfg)}
        onShowToast={showToast}
      />

      {/* 스마트폰 학생 참여 QR 코드 모달 */}
      <ClassQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        config={config}
        onShowToast={showToast}
      />

      {/* 플로팅 토스트 */}
      <Toast toasts={toasts} />
    </div>
  );
}

