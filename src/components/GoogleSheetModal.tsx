import React, { useState } from 'react';
import { GoogleSheetConfig } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE, testGoogleSheet, saveConfig, exportDataAsCSV } from '../services/googleSheets';
import { X, Copy, Check, ExternalLink, Database, CheckCircle2, AlertCircle, Download, School, Sparkles } from 'lucide-react';

interface GoogleSheetModalProps {
  config: GoogleSheetConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: GoogleSheetConfig) => void;
  onShowToast: (msg: string) => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  onShowToast,
}) => {
  const [urlInput, setUrlInput] = useState(config.webAppUrl);
  const [schoolInput, setSchoolInput] = useState(config.schoolName || '숭곡중학교');
  const [classInput, setClassInput] = useState(config.className || '보건실 마음쉼표');
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setIsCopied(true);
      onShowToast('Code.gs 스크립트 코드가 복사되었어요!');
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      onShowToast('복사에 실패했습니다. 아래 텍스트를 직접 복사해주세요.');
    }
  };

  const handleTestAndSave = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      // URL을 비우면 로컬 모드로 저장
      const newCfg: GoogleSheetConfig = {
        ...config,
        webAppUrl: '',
        isConnected: false,
        schoolName: schoolInput.trim() || '행복한 학교',
        className: classInput.trim() || '우리 반',
      };
      saveConfig(newCfg);
      onSaveConfig(newCfg);
      onShowToast('로컬 저장 모드로 설정되었습니다.');
      onClose();
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const res = await testGoogleSheet(trimmed);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      const newCfg: GoogleSheetConfig = {
        ...config,
        webAppUrl: trimmed,
        isConnected: true,
        lastConnectedAt: new Date().toISOString(),
        schoolName: schoolInput.trim() || '행복한 학교',
        className: classInput.trim() || '우리 반',
      };
      saveConfig(newCfg);
      onSaveConfig(newCfg);
      onShowToast('구글 시트 연동 설정이 성공적으로 저장되었습니다!');
    }
  };

  const handleExportCSV = () => {
    const ok = exportDataAsCSV();
    if (ok) onShowToast('CSV 파일을 다운로드했습니다.');
    else onShowToast('저장된 학생 기록이 없습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 모달 헤더 */}
        <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                구글 시트(Google Sheets) 실시간 연동 설정
              </h3>
              <p className="text-xs text-slate-500">
                별도의 백엔드 서버 없이 구글 시트를 학급 데이터베이스로 사용합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* 학교 및 학급 이름 설정 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <School className="w-4 h-4 text-indigo-600" />
              <span>학교 및 학급 정보 설정</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">학교 이름</label>
                <input
                  type="text"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder="예: 숭곡중학교"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-slate-900 text-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">학급 / 보건실 명칭</label>
                <input
                  type="text"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  placeholder="예: 1학년 2반 / 보건실"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-slate-900 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 기기 간 통합 연결 및 QR 안내 */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2 shadow-xs">
            <div className="font-semibold text-indigo-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>📱 모바일과 PC 데이터 실시간 자동 통합 방법</span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              PC에서 구글 시트 URL을 1회만 등록해두면, 상단의 <strong>[학생 QR]</strong> 버튼을 눌러 나오는 QR 코드를 스마트폰 카메라로 비추는 것만으로 모든 학생의 휴대폰이 PC와 동일한 시트로 자동 연결되어 데이터가 한곳에 실시간 통합됩니다.
            </p>
          </div>

          {/* 4단계 연동 안내 가이드 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-xs">
            <div className="font-semibold text-indigo-600 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4" />
              <span>구글 시트 연동 초간단 4단계 가이드</span>
            </div>
            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>
                새 <strong>Google 스프레드시트</strong>를 만들고 이름을 정합니다.
              </li>
              <li>
                시트 상단 메뉴 <strong>[확장 프로그램] → [Apps Script]</strong>를 클릭합니다.
              </li>
              <li>
                아래의 <strong>Code.gs</strong> 코드를 복사하여 편집기에 붙여넣고 저장(Ctrl+S)합니다.
              </li>
              <li>
                상단 <strong>[배포] → [새 배포]</strong> 클릭 후 <strong>유형: 웹 앱</strong>, <strong>액세스 권한: [모든 사용자(Anyone)]</strong>로 설정 후 배포하여 발급된 URL을 아래에 입력합니다.
              </li>
            </ol>
          </div>

          {/* Code.gs 코드 복사 박스 */}
          <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl space-y-2 border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-indigo-400">
                📄 Code.gs (Google Apps Script)
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? '복사됨!' : '스크립트 전체 복사'}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono bg-black/40 p-2.5 rounded-xl max-h-32 overflow-y-auto text-slate-300 leading-relaxed whitespace-pre-wrap">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>

          {/* 웹 앱 URL 입력창 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-xs">
            <label className="text-xs font-semibold text-slate-800 block">
              발급받은 구글 웹 앱 URL (Web App URL) 입력
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-slate-900 text-slate-800"
            />

            {testResult && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <p className="leading-relaxed">{testResult.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleTestAndSave}
                disabled={isTesting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isTesting ? '연동 테스트 중...' : '연동 테스트 및 설정 저장'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 백업</span>
              </button>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
