import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, ShieldCheck, X, AlertCircle, Sparkles, Settings2 } from 'lucide-react';
import { verifyAdminPin, setAdminPin, syncAdminPinFromRemote } from '../services/googleSheets';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetTitle?: string;
  targetDescription?: string;
  badgeText?: string;
  confirmBtnText?: string;
  isBoguniMode?: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetTitle = '교사용 관리자 인증',
  targetDescription = '전자칠판 및 구글 시트 연동 설정은 교사 및 관리자 전용 기능입니다.',
  badgeText = '교사 / 진행자 권한 확인',
  confirmBtnText = '인증 및 열기',
  isBoguniMode = false,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsChangingPin(false);
      setChangeSuccessMsg('');
      syncAdminPinFromRemote(); // 모달 열릴 때 원격 구글 시트로부터 최신 PIN 확인
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('비밀번호를 입력해주세요.');
      return;
    }

    if (verifyAdminPin(pin)) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. (초기 기본 비밀번호: 1234)');
    }
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPin(currentPinInput)) {
      setErrorMsg('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPinInput.length < 2) {
      setErrorMsg('새 비밀번호는 2자리 이상 입력해주세요.');
      return;
    }
    if (newPinInput !== newPinConfirm) {
      setErrorMsg('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsSaving(true);
    const success = await setAdminPin(newPinInput);
    setIsSaving(false);

    if (success) {
      setChangeSuccessMsg('비밀번호가 성공적으로 변경되었습니다!');
      setErrorMsg('');
      setCurrentPinInput('');
      setNewPinInput('');
      setNewPinConfirm('');
      setTimeout(() => {
        setIsChangingPin(false);
        setChangeSuccessMsg('');
      }, 1200);
    } else {
      setErrorMsg('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 모달 상단 */}
        <div className={`px-5 py-4 flex items-center justify-between ${isBoguniMode ? 'bg-indigo-900 text-white' : 'bg-slate-900 text-white'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${isBoguniMode ? 'bg-indigo-800 text-amber-300 border-indigo-700 text-lg' : 'bg-slate-800 text-indigo-400 border-slate-700'}`}>
              {isBoguniMode ? '🎁' : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100">
                {isChangingPin ? '관리자 비밀번호 변경' : targetTitle}
              </h3>
              <p className="text-[11px] text-slate-300">{badgeText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-5 sm:p-6 space-y-4">
          {!isChangingPin ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${isBoguniMode ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-slate-50 border-slate-200/80 text-slate-600'}`}>
                <p className="font-bold text-sm flex items-center gap-1.5 text-slate-900">
                  {isBoguniMode ? '🎁 보거니 관리자에게 보여주세요!' : <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                  <span>{isBoguniMode ? '실천 다짐 확인 & 상품 수령' : '관리자 잠금 보호'}</span>
                </p>
                <p className="leading-relaxed text-xs text-slate-700">{targetDescription}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBoguniMode ? '보거니 관리자 암호 입력' : '관리자 비밀번호 (PIN) 입력'}
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="관리자 비밀번호 입력"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 tracking-wider text-slate-800"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-xs transition-all shadow-xs ${
                    isBoguniMode
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {confirmBtnText}
                </button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setErrorMsg('');
                  }}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>비밀번호를 변경하고 싶으신가요?</span>
                </button>
              </div>
            </form>
          ) : (
            /* 비밀번호 변경 화면 */
            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 bg-slate-50 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="새로 사용할 비밀번호"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 bg-slate-50 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={newPinConfirm}
                    onChange={(e) => setNewPinConfirm(e.target.value)}
                    placeholder="새 비밀번호 재입력"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 bg-slate-50 text-slate-800"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {changeSuccessMsg && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{changeSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setErrorMsg('');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                >
                  돌아가기
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  비밀번호 저장
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
