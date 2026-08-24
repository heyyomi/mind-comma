import { CheckinResult, ClassroomBoardNote, ConcernNote, GoogleSheetConfig, PlanData } from '../types';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [마음 쉼표, 스트레스 Free Day] Google Apps Script (Code.gs)
 * 
 * 1. 이 코드를 복사하여 구글 시트 > [확장 프로그램] > [Apps Script] 에 붙여넣으세요.
 * 2. 상단 [배포] > [새 배포] > 유형: [웹 앱] 선택
 * 3. 다음 사용자 계정으로 실행: [나] / 액세스 권한: [모든 사용자(Anyone)] 선택 후 [배포] 클릭
 * 4. 발급된 "웹 앱 URL"을 웹 애플리케이션의 [구글 시트 연동 설정]에 붙여넣으세요!
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, "마음쉼표_기록");
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", count: 0, items: [] });
    }
    
    var headers = data[0];
    var items = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var item = {};
      for (var j = 0; j < headers.length; j++) {
        item[headers[j]] = row[j];
      }
      items.push(item);
    }
    
    return createJsonResponse({ status: "success", count: items.length, items: items.reverse() });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, "마음쉼표_기록");
    var body = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    
    var now = new Date();
    var timeString = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    
    var rowData = [
      timeString,
      body.type || "실천다짐",
      body.studentName || "익명",
      body.gradeClass || "우리반",
      body.stressScore || "",
      body.stressTier || "",
      body.categories || "",
      body.situation || "",
      body.method || "",
      body.reason || "",
      body.whenTime || "",
      body.how || "",
      body.expect || "",
      body.cheer || ""
    ];
    
    sheet.appendRow(rowData);
    
    return createJsonResponse({ status: "success", message: "저장되었습니다.", time: timeString });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow([
      "일시", "유형", "이름", "학급", "스트레스점수", "스트레스단계", 
      "주요원인", "상황설명", "실천방법", "선택이유", "실천시기", "실천방법세부", 
      "기대효과", "나에게응원"
    ]);
    sheet.getRange(1, 1, 1, 14).setBackground("#E0E7FF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

const CONFIG_KEY = 'stress_free_sheet_config_v1';
const LOCAL_NOTES_KEY = 'stress_free_local_notes_v1';
const LOCAL_CONCERNS_KEY = 'stress_free_local_concerns_v1';
const LOCAL_CHECKINS_KEY = 'stress_free_local_checkins_v1';
const ADMIN_PIN_KEY = 'stress_free_admin_pin_v1';
const DEFAULT_ADMIN_PIN = '1234';

// === 관리자 비밀번호 (PIN) 유틸리티 ===
export const getAdminPin = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PIN_KEY);
    if (saved) return saved;
  } catch (e) {
    console.error('Failed to get admin PIN:', e);
  }
  return DEFAULT_ADMIN_PIN;
};

export const setAdminPin = (newPin: string): boolean => {
  try {
    const cleanPin = newPin.trim();
    if (!cleanPin) return false;
    localStorage.setItem(ADMIN_PIN_KEY, cleanPin);
    return true;
  } catch (e) {
    console.error('Failed to set admin PIN:', e);
    return false;
  }
};

export const verifyAdminPin = (inputPin: string): boolean => {
  const currentPin = getAdminPin();
  return inputPin.trim() === currentPin.trim();
};

export const resetAdminPin = (): void => {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_ADMIN_PIN);
  } catch (e) {
    console.error('Failed to reset admin PIN:', e);
  }
};

// === 구글 시트 환경설정 유틸리티 ===
export const getSavedConfig = (): GoogleSheetConfig => {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sheet config:', e);
  }
  return {
    webAppUrl: '',
    sheetName: '마음쉼표_기록',
    isConnected: false,
    schoolName: '숭곡중학교',
    className: '보건실 마음쉼표',
  };
};

export const saveConfig = (config: GoogleSheetConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// === STEP 5 실천 다짐 (종이비행기) 로컬 저장소 ===
export const getLocalNotes = (): ClassroomBoardNote[] => {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local notes:', e);
  }
  return [];
};

export const saveLocalNote = (note: ClassroomBoardNote) => {
  const current = getLocalNotes();
  const updated = [note, ...current];
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));
};

// === STEP 3 고민 및 마음 들여다보기 로컬 저장소 ===
export const getLocalConcerns = (): ConcernNote[] => {
  try {
    const raw = localStorage.getItem(LOCAL_CONCERNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local concerns:', e);
  }
  return [];
};

export const saveLocalConcern = (concern: ConcernNote) => {
  const current = getLocalConcerns();
  const updated = [concern, ...current];
  localStorage.setItem(LOCAL_CONCERNS_KEY, JSON.stringify(updated));
};

export const likeLocalConcern = (concernId: string) => {
  const current = getLocalConcerns();
  const updated = current.map((c) => (c.id === concernId ? { ...c, likes: (c.likes || 0) + 1 } : c));
  localStorage.setItem(LOCAL_CONCERNS_KEY, JSON.stringify(updated));
  return updated;
};

// === STEP 2 자가진단 로컬 저장소 ===
export const getLocalCheckins = (): CheckinResult[] => {
  try {
    const raw = localStorage.getItem(LOCAL_CHECKINS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local checkins:', e);
  }
  return [];
};

export const saveLocalCheckin = (checkin: CheckinResult) => {
  const current = getLocalCheckins();
  const updated = [checkin, ...current];
  localStorage.setItem(LOCAL_CHECKINS_KEY, JSON.stringify(updated));
};

// 구글 시트 웹앱 연결 테스트
export const testGoogleSheet = async (webAppUrl: string): Promise<{ success: boolean; message: string }> => {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: false, message: '올바른 웹 앱 URL(https://script.google.com/...)을 입력해주세요.' };
  }
  try {
    const response = await fetch(webAppUrl, {
      method: 'GET',
      mode: 'cors',
    });
    if (response.ok) {
      return { success: true, message: '구글 시트 웹 앱과 정상적으로 연결되었습니다!' };
    }
    return { success: false, message: `응답 오류 (${response.status}) - 배포 설정 권한(모든 사용자)을 확인해주세요.` };
  } catch (err: any) {
    // CORS 제약이 있는 경우 no-cors 핑 시도
    try {
      await fetch(webAppUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ type: '연결테스트' }) });
      return { success: true, message: '웹 앱 URL로 요청을 전송할 수 있습니다. (no-cors 모드 지원)' };
    } catch (e2: any) {
      return { success: false, message: '연결 실패: 웹 앱 배포 시 [액세스 권한: 모든 사용자]로 배포되었는지 확인해주세요.' };
    }
  }
};

// STEP 3 고민 및 마음 들여다보기 저장 전송
export const submitConcernRecord = async (
  studentName: string,
  categories: string[],
  situation: string,
  checkin?: CheckinResult | null
): Promise<{ success: boolean; isRemote: boolean; noteId: string }> => {
  const config = getSavedConfig();
  const noteId = 'concern-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const safeName = typeof studentName === 'string' ? studentName.trim() : '';
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSituation = typeof situation === 'string' ? situation : '';

  const newConcern: ConcernNote = {
    id: noteId,
    studentName: safeName || '익명 친구',
    gradeClass: config.className || '우리 반',
    categories: safeCategories,
    situation: safeSituation,
    createdAt: new Date().toLocaleString(),
    colorIndex: Math.floor(Math.random() * 5),
    likes: 0,
  };

  // 1. 로컬 저장 (항상 먼저 안전하게 로컬에 기록)
  saveLocalConcern(newConcern);

  if (!config.webAppUrl) {
    return { success: true, isRemote: false, noteId };
  }

  // 2. 구글 시트 POST
  try {
    const payload = {
      type: '고민나눔',
      studentName: safeName || '익명 친구',
      gradeClass: config.className || '우리 반',
      stressScore: checkin ? checkin.score : '',
      stressTier: checkin ? checkin.tier : '',
      categories: safeCategories.join(', '),
      situation: safeSituation,
      method: '',
      reason: '',
      whenTime: '',
      how: '',
      expect: '',
      cheer: '',
    };

    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return { success: true, isRemote: true, noteId };
  } catch (error) {
    console.warn('Google Sheets concern transmission error (saved locally):', error);
    return { success: true, isRemote: false, noteId };
  }
};

// STEP 5 실천 다짐(종이비행기) 저장 전송
export const submitPlanRecord = async (
  plan: PlanData,
  checkin?: CheckinResult | null,
  factorCategories: string[] = [],
  situation: string = ''
): Promise<{ success: boolean; isRemote: boolean }> => {
  const newNote: ClassroomBoardNote = {
    id: plan.id,
    method: plan.method,
    reason: plan.reason,
    when: plan.when,
    how: plan.how,
    expect: plan.expect,
    cheer: plan.cheer,
    studentName: plan.studentName || '익명',
    gradeClass: plan.gradeClass || '우리 반',
    createdAt: plan.createdAt,
    colorIndex: Math.floor(Math.random() * 5),
  };

  // 1. 로컬 보관
  saveLocalNote(newNote);

  const config = getSavedConfig();
  if (!config.webAppUrl) {
    return { success: true, isRemote: false };
  }

  // 2. 구글 시트로 POST 전송
  try {
    const payload = {
      type: '실천다짐',
      studentName: plan.studentName || '익명',
      gradeClass: plan.gradeClass || config.className,
      stressScore: checkin ? checkin.score : '',
      stressTier: checkin ? checkin.tier : '',
      categories: factorCategories.join(', '),
      situation: situation,
      method: plan.method,
      reason: plan.reason,
      whenTime: plan.when,
      how: plan.how,
      expect: plan.expect,
      cheer: plan.cheer,
    };

    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return { success: true, isRemote: true };
  } catch (error) {
    console.warn('Google Sheets transmission error (saved locally):', error);
    return { success: true, isRemote: false };
  }
};

// 체크인(자가진단) 저장 전송
export const submitCheckinRecord = async (
  checkin: CheckinResult,
  studentName = '익명',
  gradeClass = '우리 반'
) => {
  saveLocalCheckin(checkin);
  const config = getSavedConfig();
  if (!config.webAppUrl) return;

  try {
    const payload = {
      type: '자가진단',
      studentName,
      gradeClass: config.className || gradeClass,
      stressScore: checkin.score,
      stressTier: checkin.tier,
    };
    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
  } catch (e) {
    console.warn('Checkin sheet post fallback to local:', e);
  }
};

// 시트에서 2가지 종류의 전자칠판 데이터(고민 게시판 + 실천다짐 게시판) 가져오기
export const fetchClassData = async (): Promise<{
  plans: ClassroomBoardNote[];
  concerns: ConcernNote[];
}> => {
  const config = getSavedConfig();
  let remotePlans: ClassroomBoardNote[] = [];
  let remoteConcerns: ConcernNote[] = [];

  if (config.webAppUrl) {
    try {
      const response = await fetch(config.webAppUrl, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const json = await response.json();
        if (json && json.status === 'success' && Array.isArray(json.items)) {
          // 실천 다짐 파싱
          remotePlans = json.items
            .filter((item: any) => (item['실천방법'] || item.method) && item['유형'] !== '고민나눔')
            .map((item: any, idx: number) => ({
              id: 'remote-plan-' + idx + '-' + Date.now(),
              method: item['실천방법'] || item.method || '',
              reason: item['선택이유'] || item.reason || '',
              when: item['실천시기'] || item.whenTime || '',
              how: item['실천방법세부'] || item.how || '',
              expect: item['기대효과'] || item.expect || '',
              cheer: item['나에게응원'] || item.cheer || '',
              studentName: item['이름'] || item.studentName || '익명',
              gradeClass: item['학급'] || item.gradeClass || '우리 반',
              createdAt: item['일시'] || new Date().toLocaleString(),
              colorIndex: idx % 5,
            }));

          // 고민 나눔 파싱
          remoteConcerns = json.items
            .filter((item: any) => (item['상황설명'] || item.situation || item['주요원인'] || item.categories) && item['유형'] === '고민나눔')
            .map((item: any, idx: number) => {
              const catRaw = item['주요원인'] || item.categories || '';
              const categories = typeof catRaw === 'string' ? catRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
              return {
                id: 'remote-concern-' + idx + '-' + Date.now(),
                studentName: item['이름'] || item.studentName || '익명 친구',
                gradeClass: item['학급'] || item.gradeClass || '우리 반',
                categories,
                situation: item['상황설명'] || item.situation || '',
                createdAt: item['일시'] || new Date().toLocaleString(),
                colorIndex: idx % 5,
                likes: 0,
              };
            });
        }
      }
    } catch (e) {
      console.warn('Could not fetch from remote sheet, merging with local:', e);
    }
  }

  const localPlans = getLocalNotes();
  const localConcerns = getLocalConcerns();

  const finalPlans = remotePlans.length > 0 ? remotePlans : localPlans;
  const finalConcerns = remoteConcerns.length > 0 ? remoteConcerns : localConcerns;

  return {
    plans: finalPlans,
    concerns: finalConcerns,
  };
};

export const fetchClassNotes = async (): Promise<ClassroomBoardNote[]> => {
  const { plans } = await fetchClassData();
  return plans;
};

// CSV 내보내기 함수 (실천 다짐 + 고민 목록 통합 백업)
export const exportDataAsCSV = (mode: 'all' | 'plans' | 'concerns' = 'all') => {
  const notes = getLocalNotes();
  const concerns = getLocalConcerns();

  if (notes.length === 0 && concerns.length === 0) {
    return false;
  }

  let csvContent = '\uFEFF';

  if (mode === 'all' || mode === 'plans') {
    csvContent += '--- [1. 실천 다짐 종이비행기 기록] ---\n';
    const planHeaders = ['일시', '이름', '학급', '실천방법', '선택이유', '실천시기', '실천세부', '기대효과', '응원문구'];
    const planRows = notes.map((n) => [
      `"${n.createdAt}"`,
      `"${n.studentName || '익명'}"`,
      `"${n.gradeClass || '우리반'}"`,
      `"${(n.method || '').replace(/"/g, '""')}"`,
      `"${(n.reason || '').replace(/"/g, '""')}"`,
      `"${(n.when || '').replace(/"/g, '""')}"`,
      `"${(n.how || '').replace(/"/g, '""')}"`,
      `"${(n.expect || '').replace(/"/g, '""')}"`,
      `"${(n.cheer || '').replace(/"/g, '""')}"`,
    ]);
    csvContent += [planHeaders.join(','), ...planRows.map((r) => r.join(','))].join('\n') + '\n\n';
  }

  if (mode === 'all' || mode === 'concerns') {
    csvContent += '--- [2. 나를 들여다보기 고민나눔 기록] ---\n';
    const concernHeaders = ['일시', '이름', '학급', '스트레스원인', '구체적상황', '공감수'];
    const concernRows = concerns.map((c) => [
      `"${c.createdAt}"`,
      `"${c.studentName || '익명'}"`,
      `"${c.gradeClass || '우리반'}"`,
      `"${(c.categories || []).join(', ')}"`,
      `"${(c.situation || '').replace(/"/g, '""')}"`,
      `"${c.likes || 0}"`,
    ]);
    csvContent += [concernHeaders.join(','), ...concernRows.map((r) => r.join(','))].join('\n');
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `마음쉼표_스트레스프리데이_데이터백업_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
};

