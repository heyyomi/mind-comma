import React, { useState } from 'react';
import { GoogleSheetConfig } from '../types';
import { generateClassroomShareUrl } from '../services/googleSheets';
import { X, Copy, Check, QrCode, Sparkles, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClassQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetConfig;
  onShowToast: (msg: string) => void;
}

export const ClassQrModal: React.FC<ClassQrModalProps> = ({
  isOpen,
  onClose,
  config,
  onShowToast,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = generateClassroomShareUrl(false);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
    shareUrl
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      onShowToast('학급 참여 링크가 복사되었습니다! 카카오톡이나 메시지로 전달해보세요.');
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      onShowToast('링크 복사에 실패했습니다. 주소를 직접 복사해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{config.schoolName || '온기 학교'} · {config.className || '우리 반'}</span>
          </div>
          <h3 className="font-bold text-lg text-slate-900">
            스마트폰 / 학생 참여 QR 코드
          </h3>
          <p className="text-xs text-slate-500 max-w-xs">
            휴대폰 카메라로 아래 QR 코드를 비추면 PC와 동일한 시트 및 비밀번호로 자동 통합 연결됩니다.
          </p>
        </div>

        {/* QR 코드 이미지 박스 */}
        <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-indigo-200 shadow-inner flex flex-col items-center">
          <img
            src={qrImageUrl}
            alt="학급 참여 QR 코드"
            className="w-56 h-56 object-contain rounded-xl"
            loading="eager"
          />
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>스캔 시 구글 시트 자동 연결 & 실시간 통합</span>
          </div>
        </div>

        {/* 시트 연동 상태 알림 */}
        {!config.webAppUrl && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5 text-left w-full">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              현재 PC에 <strong>구글 시트 URL</strong>이 등록되지 않아 로컬 링크로 공유됩니다. 모든 기기의 데이터를 한곳에 모으려면 먼저 [구글 시트 연동]을 완료해주세요.
            </p>
          </div>
        )}

        {/* 링크 복사 영역 */}
        <div className="w-full space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? '참여 링크 복사 완료!' : '학급 접속 링크 복사하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
