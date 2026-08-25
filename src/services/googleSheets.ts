import { CheckinResult, ClassroomBoardNote, ConcernNote, GoogleSheetConfig, PlanData } from '../types';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [온기, 마음 쉼표, 스트레스 Free Day] Google Apps Script (Code.gs)
 * 
 * 1인 1줄(한 행) 통합 저장 & 실시간 전자칠판 전 기기 동기화 시스템:
 * 학생 1명당 1개의 행만 생성되며 [일시, 이름, 학급, 스트레스점수 ~ 나에게응원]까지 모든 내용이 한 줄로 통합 수합됩니다.
 * 
 * 1. 이 코드를 복사하여 구글 시트 > [확장 프로그램] > [Apps Script] 에 붙여넣으세요.
 * 2. 상단 [배포] > [새 배포] (또는 배포 관리 > 새 버전) > 유형: [웹 앱] 선택
 * 3. 다음 사용자 계정으로 실행: [나] / 액세스 권한: [모든 사용자(Anyone)] 선택 후 [배포] 클릭
 * 4. 발급된 "웹 앱 URL"을 웹 애플리케이션의 [구글 시트 연동 설정]에 붙여넣으세요!
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e && e.parameter ? e.parameter.action : "";
    var callback = e && e.parameter ? (e.parameter.callback || e.parameter.prefix) : "";
    
    // 1. 관리자 PIN 조회 요청
    if (action === "getPin") {
      var configSheet = getOrCreateConfigSheet(ss);
      var currentPin = getPinFromConfigSheet(configSheet);
      return createJsonResponse({ status: "success", pin: currentPin }, callback);
    }

    var sheet = getOrCreateSheet(ss, "마음쉼표_기록");
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", count: 0, items: [] }, callback);
    }
    
    var headers = data[0];
    var items = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // 빈 행 건너뛰기
      var hasValue = false;
      for (var k = 0; k < row.length; k++) {
        if (row[k] !== "" && row[k] !== undefined && row[k] !== null) {
          hasValue = true;
          break;
        }
      }
      if (!hasValue) continue;

      var item = {};
      for (var j = 0; j < headers.length; j++) {
        var hName = String(headers[j] || ("col" + j)).trim();
        item[hName] = row[j];
      }
      
      // 위치 기반 표준 필드 매핑 (헤더명이 달라도 완벽 호환 보장)
      item["_rowIndex"] = i + 1;
      item["time"] = String(row[0] || "");
      item["type"] = String(row[1] || "");
      item["studentName"] = String(row[2] || "익명");
      item["gradeClass"] = String(row[3] || "우리반");
      item["stressScore"] = row[4] !== undefined ? row[4] : "";
      item["stressTier"] = String(row[5] || "");
      item["categories"] = String(row[6] || "");
      item["situation"] = String(row[7] || "");
      item["method"] = String(row[8] || "");
      item["reason"] = String(row[9] || "");
      item["whenTime"] = String(row[10] || "");
      item["how"] = String(row[11] || "");
      item["expect"] = String(row[12] || "");
      item["cheer"] = String(row[13] || "");
      item["sessionId"] = String(row[14] || "");
      
      items.push(item);
    }
    
    return createJsonResponse({ status: "success", count: items.length, items: items.reverse() }, callback);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() }, callback);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (ex) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }
    
    // 1. 관리자 PIN 변경 요청
    if (body && body.action === "updatePin") {
      var newPin = String(body.newPin || "1234").trim();
      var configSheet = getOrCreateConfigSheet(ss);
      savePinToConfigSheet(configSheet, newPin);
      return createJsonResponse({ status: "success", message: "관리자 PIN이 원격 시트에 동기화되었습니다.", pin: newPin });
    }

    // 2. 전체 데이터 초기화 (테스트 데이터 비우기) 요청
    if (body && body.action === "clearAll") {
      var recordSheet = getOrCreateSheet(ss, "마음쉼표_기록");
      var lastRow = recordSheet.getLastRow();
      if (lastRow > 1) {
        recordSheet.deleteRows(2, lastRow - 1);
      }
      return createJsonResponse({ status: "success", message: "모든 기록이 초기화되었습니다." });
    }

    // 3. 개별 항목 삭제 요청
    if (body && body.action === "deleteItem") {
      var targetSheet = getOrCreateSheet(ss, "마음쉼표_기록");
      var allData = targetSheet.getDataRange().getValues();
      var deleted = false;
      
      for (var r = allData.length - 1; r >= 1; r--) {
        var rowVal = allData[r];
        var rowName = String(rowVal[2] || "");
        var rowSituation = String(rowVal[7] || "");
        var rowMethod = String(rowVal[8] || "");

        var matchName = !body.studentName || rowName === body.studentName;
        var matchContent = (!body.situation && !body.method) || 
                           (body.situation && rowSituation === body.situation) || 
                           (body.method && rowMethod === body.method);

        if (matchName && matchContent) {
          targetSheet.deleteRow(r + 1);
          deleted = true;
          break;
        }
      }
      return createJsonResponse({ status: "success", deleted: deleted, message: deleted ? "항목이 삭제되었습니다." : "해당 항목을 찾을 수 없습니다." });
    }

    var sheet = getOrCreateSheet(ss, "마음쉼표_기록");
    var now = new Date();
    var timeString = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");

    var sessionId = String(body.sessionId || "").trim();
    var studentName = String(body.studentName || "익명").trim();
    var gradeClass = String(body.gradeClass || "우리반").trim();
    var type = body.method ? "실천다짐" : (body.type || "고민나눔");

    var allData = sheet.getDataRange().getValues();
    var existingRowIndex = -1;

    // 1인 1행 통합: 기존에 작성된 같은 학생/세션의 행이 있는지 검색
    if (allData.length > 1) {
      for (var i = allData.length - 1; i >= 1; i--) {
        var rVal = allData[i];
        var rSession = String(rVal[14] || "").trim();
        var rName = String(rVal[2] || "").trim();
        var rClass = String(rVal[3] || "").trim();

        // 1순위: sessionId 일치
        if (sessionId && rSession && sessionId === rSession) {
          existingRowIndex = i + 1;
          break;
        }

        // 2순위: sessionId가 없거나 매칭 안되더라도, 동일 학생 이름&학급이고 이전 행의 실천방법이 비어있는 경우
        if (studentName !== "익명" && rName === studentName && rClass === gradeClass && !rVal[8]) {
          existingRowIndex = i + 1;
          break;
        }
      }
    }

    if (existingRowIndex > 1) {
      // 기존 행 업데이트: 이전 데이터 보존 및 신규 입력 필드 병합 (1인 1줄 완성)
      var prevRow = allData[existingRowIndex - 1];
      var mergedData = [
        timeString,
        body.method ? "실천다짐" : (prevRow[1] || type),
        studentName !== "익명" ? studentName : (prevRow[2] || studentName),
        gradeClass !== "우리반" ? gradeClass : (prevRow[3] || gradeClass),
        (body.stressScore !== undefined && body.stressScore !== "") ? body.stressScore : (prevRow[4] || ""),
        body.stressTier || prevRow[5] || "",
        body.categories || prevRow[6] || "",
        body.situation || prevRow[7] || "",
        body.method || prevRow[8] || "",
        body.reason || prevRow[9] || "",
        body.whenTime || prevRow[10] || "",
        body.how || prevRow[11] || "",
        body.expect || prevRow[12] || "",
        body.cheer || prevRow[13] || "",
        sessionId || prevRow[14] || ""
      ];
      sheet.getRange(existingRowIndex, 1, 1, mergedData.length).setValues([mergedData]);
      return createJsonResponse({ status: "success", message: "1인 1행 데이터가 성공적으로 갱신되었습니다.", time: timeString, updatedRow: existingRowIndex });
    } else {
      // 신규 학생 행 추가
      var newRowData = [
        timeString,
        type,
        studentName,
        gradeClass,
        (body.stressScore !== undefined && body.stressScore !== "") ? body.stressScore : "",
        body.stressTier || "",
        body.categories || "",
        body.situation || "",
        body.method || "",
        body.reason || "",
        body.whenTime || "",
        body.how || "",
        body.expect || "",
        body.cheer || "",
        sessionId
      ];
      sheet.appendRow(newRowData);
      return createJsonResponse({ status: "success", message: "저장되었습니다.", time: timeString });
    }
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
      "기대효과", "나에게응원", "세션식별자"
    ]);
    sheet.getRange(1, 1, 1, 15).setBackground("#E0E7FF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateConfigSheet(ss) {
  var sheet = ss.getSheetByName("마음쉼표_설정");
  if (!sheet) {
    sheet = ss.insertSheet("마음쉼표_설정");
    sheet.appendRow(["항목", "설정값"]);
    sheet.appendRow(["관리자_PIN", "1234"]);
    sheet.getRange(1, 1, 1, 2).setBackground("#FEF3C7").setFontWeight("bold");
  }
  return sheet;
}

function getPinFromConfigSheet(sheet) {
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === "관리자_PIN") {
      return String(data[i][1] || "1234").trim();
    }
  }
  return "1234";
}

function savePinToConfigSheet(sheet, newPin) {
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === "관리자_PIN") {
      sheet.getRange(i + 1, 2).setValue(String(newPin).trim());
      return;
    }
  }
  sheet.appendRow(["관리자_PIN", String(newPin).trim()]);
}

function createJsonResponse(data, callback) {
  var output = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + output + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(output)
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

// 원격 구글 시트에서 관리자 PIN 동기화 가져오기
export const syncAdminPinFromRemote = async (): Promise<string> => {
  const config = getSavedConfig();
  if (!config.webAppUrl) return getAdminPin();

  try {
    const url = config.webAppUrl.includes('?') 
      ? `${config.webAppUrl}&action=getPin&_t=${Date.now()}`
      : `${config.webAppUrl}?action=getPin&_t=${Date.now()}`;
      
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (response.ok) {
      const json = await response.json();
      if (json && json.status === 'success' && json.pin) {
        const remotePin = String(json.pin).trim();
        if (remotePin) {
          localStorage.setItem(ADMIN_PIN_KEY, remotePin);
          return remotePin;
        }
      }
    }
  } catch (e) {
    console.warn('Could not sync admin PIN from Google Sheet:', e);
  }
  return getAdminPin();
};

export const setAdminPin = async (newPin: string): Promise<boolean> => {
  try {
    const cleanPin = newPin.trim();
    if (!cleanPin) return false;
    localStorage.setItem(ADMIN_PIN_KEY, cleanPin);

    // 원격 구글 시트가 연결되어 있다면 시트에도 동기화 전송
    const config = getSavedConfig();
    if (config.webAppUrl) {
      try {
        await fetch(config.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'updatePin',
            newPin: cleanPin,
          }),
          mode: 'no-cors',
        });
      } catch (err) {
        console.warn('Could not update PIN to remote sheet:', err);
      }
    }
    return true;
  } catch (e) {
    console.error('Failed to set admin PIN:', e);
    return false;
  }
};

// 동기식 PIN 검증 (로컬 기준)
export const verifyAdminPin = (inputPin: string): boolean => {
  const currentPin = getAdminPin();
  return inputPin.trim() === currentPin.trim();
};

// 비동기식 PIN 검증 (원격 구글 시트 최신 PIN까지 실시간 확인)
export const verifyAdminPinAsync = async (inputPin: string): Promise<boolean> => {
  const trimmed = inputPin.trim();
  if (trimmed === getAdminPin().trim()) {
    return true;
  }

  const config = getSavedConfig();
  if (config.webAppUrl) {
    try {
      const latestPin = await syncAdminPinFromRemote();
      if (trimmed === latestPin.trim()) {
        return true;
      }
    } catch (e) {
      console.warn('Remote pin verification error:', e);
    }
  }
  return false;
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

// 학생 및 다른 기기에 공유할 링크 생성 (모든 설정값 및 PIN 포함)
export const generateClassroomShareUrl = (boardOnly = false): string => {
  const config = getSavedConfig();
  const pin = getAdminPin();
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  if (boardOnly) {
    params.set('board', '1');
  }
  if (config.webAppUrl) {
    params.set('sheetUrl', config.webAppUrl.trim());
  }
  if (config.schoolName) {
    params.set('school', config.schoolName);
  }
  if (config.className) {
    params.set('class', config.className);
  }
  if (pin && pin !== DEFAULT_ADMIN_PIN) {
    params.set('pin', pin);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

// URL 파라미터로부터 설정 및 PIN 자동 주입
export const applyUrlConfigParams = (): boolean => {
  try {
    const params = new URLSearchParams(window.location.search);
    const sheetUrl = params.get('sheetUrl') || params.get('url');
    const school = params.get('school');
    const className = params.get('class') || params.get('className');
    const pin = params.get('pin');

    let updated = false;
    const currentConfig = getSavedConfig();

    if (sheetUrl && sheetUrl.trim() !== currentConfig.webAppUrl) {
      currentConfig.webAppUrl = sheetUrl.trim();
      currentConfig.isConnected = true;
      updated = true;
    }
    if (school && school.trim() !== currentConfig.schoolName) {
      currentConfig.schoolName = school.trim();
      updated = true;
    }
    if (className && className.trim() !== currentConfig.className) {
      currentConfig.className = className.trim();
      updated = true;
    }

    if (updated) {
      saveConfig(currentConfig);
    }

    if (pin && pin.trim()) {
      localStorage.setItem(ADMIN_PIN_KEY, pin.trim());
    }

    return updated;
  } catch (e) {
    console.error('Failed to parse URL config params:', e);
    return false;
  }
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

export const deleteLocalNote = (noteId: string): ClassroomBoardNote[] => {
  const current = getLocalNotes();
  const updated = current.filter((n) => n.id !== noteId);
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));
  return updated;
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

export const deleteLocalConcern = (concernId: string): ConcernNote[] => {
  const current = getLocalConcerns();
  const updated = current.filter((c) => c.id !== concernId);
  localStorage.setItem(LOCAL_CONCERNS_KEY, JSON.stringify(updated));
  return updated;
};

export const likeLocalConcern = (concernId: string) => {
  const current = getLocalConcerns();
  const updated = current.map((c) => (c.id === concernId ? { ...c, likes: (c.likes || 0) + 1 } : c));
  localStorage.setItem(LOCAL_CONCERNS_KEY, JSON.stringify(updated));
  return updated;
};

// === 전체 테스트 데이터 비우기 (로컬 + 원격) ===
export const clearAllLocalData = () => {
  localStorage.removeItem(LOCAL_NOTES_KEY);
  localStorage.removeItem(LOCAL_CONCERNS_KEY);
  localStorage.removeItem(LOCAL_CHECKINS_KEY);
};

export const clearAllDataAndRemote = async (): Promise<boolean> => {
  // 1. 로컬 데이터 초기화
  clearAllLocalData();

  // 2. 원격 구글 시트에 초기화 요청
  const config = getSavedConfig();
  if (config.webAppUrl) {
    try {
      await fetch(config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'clearAll' }),
        mode: 'no-cors',
      });
      return true;
    } catch (e) {
      console.warn('Could not clear remote sheet:', e);
    }
  }
  return true;
};

// 원격 단일 항목 삭제 요청
export const deleteRemoteRecord = async (params: {
  studentName?: string;
  type?: string;
  situation?: string;
  method?: string;
}) => {
  const config = getSavedConfig();
  if (!config.webAppUrl) return;

  try {
    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'deleteItem',
        ...params,
      }),
      mode: 'no-cors',
    });
  } catch (e) {
    console.warn('Could not delete remote record:', e);
  }
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

// JSONP 백업 fetcher (CORS 또는 모바일 환경에서 Google Apps Script 데이터를 가장 안전하게 가져옴)
const fetchViaJsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callbackName = 'gas_callback_' + Math.random().toString(36).substring(2, 9);
    const script = document.createElement('script');
    
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP Request Timeout'));
    }, 8000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as any)[callbackName];
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}&_t=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP Script Load Error'));
    };

    document.head.appendChild(script);
  });
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
    // JSONP 시도
    const jsonpRes = await fetchViaJsonp(webAppUrl);
    if (jsonpRes && jsonpRes.status === 'success') {
      return { success: true, message: '구글 시트 웹 앱과 정상적으로 연결되었습니다! (JSONP 모드)' };
    }
    return { success: false, message: `응답 오류 (${response.status}) - 배포 설정 권한(모든 사용자)을 확인해주세요.` };
  } catch (err: any) {
    try {
      const jsonpRes = await fetchViaJsonp(webAppUrl);
      if (jsonpRes && jsonpRes.status === 'success') {
        return { success: true, message: '구글 시트 웹 앱과 정상적으로 연결되었습니다! (JSONP 모드)' };
      }
    } catch (e2) {
      // ignore
    }
    return { success: false, message: '연결 실패: 웹 앱 배포 시 [액세스 권한: 모든 사용자(Anyone)]로 배포되었는지 확인해주세요.' };
  }
};

// STEP 3 고민 및 마음 들여다보기 저장 전송
export const submitConcernRecord = async (
  studentName: string,
  categories: string[],
  situation: string,
  checkin?: CheckinResult | null,
  sessionId?: string
): Promise<{ success: boolean; isRemote: boolean; noteId: string }> => {
  const config = getSavedConfig();
  const noteId = 'concern-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const newConcern: ConcernNote = {
    id: noteId,
    studentName: studentName || '익명 친구',
    gradeClass: config.className || '우리 반',
    categories,
    situation,
    createdAt: new Date().toLocaleString(),
    colorIndex: Math.floor(Math.random() * 5),
    likes: 0,
  };

  saveLocalConcern(newConcern);

  if (!config.webAppUrl) {
    return { success: true, isRemote: false, noteId };
  }

  try {
    const payload = {
      type: '고민나눔',
      studentName: studentName || '익명 친구',
      gradeClass: config.className || '우리 반',
      stressScore: checkin ? checkin.score : '',
      stressTier: checkin ? checkin.tier : '',
      categories: categories.join(', '),
      situation,
      method: '',
      reason: '',
      whenTime: '',
      how: '',
      expect: '',
      cheer: '',
      sessionId: sessionId || '',
    };

    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return { success: true, isRemote: true, noteId };
  } catch (error) {
    console.warn('Google Sheets transmission error (saved locally):', error);
    return { success: true, isRemote: false, noteId };
  }
};

// STEP 5 실천 다짐 (종이비행기) 저장 전송 (1인 1행 통합 저장)
export const submitPlanRecord = async (
  plan: PlanData,
  checkin?: CheckinResult | null,
  factorCategories: string[] = [],
  situation: string = '',
  sessionId?: string
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
    createdAt: new Date().toLocaleString(),
    colorIndex: Math.floor(Math.random() * 5),
  };

  saveLocalNote(newNote);

  const config = getSavedConfig();
  if (!config.webAppUrl) {
    return { success: true, isRemote: false };
  }

  try {
    const payload = {
      type: '실천다짐',
      studentName: plan.studentName || '익명',
      gradeClass: plan.gradeClass || config.className || '우리 반',
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
      sessionId: sessionId || '',
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
  isRemote: boolean;
  totalRemoteCount: number;
}> => {
  const config = getSavedConfig();
  let remotePlans: ClassroomBoardNote[] = [];
  let remoteConcerns: ConcernNote[] = [];
  let isRemoteSuccess = false;
  let totalCount = 0;

  if (config.webAppUrl) {
    let json: any = null;

    // 1차 시도: 표준 Fetch CORS
    try {
      const fetchUrl = config.webAppUrl.includes('?')
        ? `${config.webAppUrl}&_t=${Date.now()}`
        : `${config.webAppUrl}?_t=${Date.now()}`;

      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        json = await response.json();
      }
    } catch (e) {
      console.warn('Direct fetch failed, attempting JSONP fallback...', e);
    }

    // 2차 시도: JSONP fallback (모바일 Safari, 웹뷰 등에서 CORS 제약 우회)
    if (!json || json.status !== 'success') {
      try {
        json = await fetchViaJsonp(config.webAppUrl);
      } catch (e2) {
        console.warn('JSONP fetch also failed:', e2);
      }
    }

    if (json && json.status === 'success' && Array.isArray(json.items)) {
      isRemoteSuccess = true;
      totalCount = json.items.length;

      // 1. 실천 다짐 파싱: 실천 방법이나 세부 내용이 있는 모든 행을 수합
      remotePlans = json.items
        .filter((item: any) => {
          const method = item['실천방법'] || item.method || item['실천방법세부'] || item.how || '';
          return String(method).trim().length > 0;
        })
        .map((item: any, idx: number) => ({
          id: 'remote-plan-' + idx + '-' + (item['일시'] || item.time || idx),
          method: String(item['실천방법'] || item.method || '').trim(),
          reason: String(item['선택이유'] || item.reason || '').trim(),
          when: String(item['실천시기'] || item.whenTime || '').trim(),
          how: String(item['실천방법세부'] || item.how || '').trim(),
          expect: String(item['기대효과'] || item.expect || '').trim(),
          cheer: String(item['나에게응원'] || item.cheer || '').trim(),
          studentName: String(item['이름'] || item.studentName || '익명').trim(),
          gradeClass: String(item['학급'] || item.gradeClass || '우리반').trim(),
          createdAt: String(item['일시'] || item.time || new Date().toLocaleString()).trim(),
          colorIndex: idx % 5,
        }));

      // 2. 고민 나눔 파싱: 상황설명이나 주요원인이 작성된 모든 행을 수합 (1인 1줄 통합 행도 포함!)
      remoteConcerns = json.items
        .filter((item: any) => {
          const situation = item['상황설명'] || item.situation || '';
          const categories = item['주요원인'] || item.categories || '';
          return String(situation).trim().length > 0 || String(categories).trim().length > 0;
        })
        .map((item: any, idx: number) => {
          const catRaw = item['주요원인'] || item.categories || '';
          const categories = typeof catRaw === 'string' 
            ? catRaw.split(',').map((s: string) => s.trim()).filter(Boolean) 
            : [];
          return {
            id: 'remote-concern-' + idx + '-' + (item['일시'] || item.time || idx),
            studentName: String(item['이름'] || item.studentName || '익명 친구').trim(),
            gradeClass: String(item['학급'] || item.gradeClass || '우리반').trim(),
            categories,
            situation: String(item['상황설명'] || item.situation || '').trim(),
            createdAt: String(item['일시'] || item.time || new Date().toLocaleString()).trim(),
            colorIndex: idx % 5,
            likes: 0,
          };
        });
    }
  }

  const localPlans = getLocalNotes();
  const localConcerns = getLocalConcerns();

  // 원격 데이터가 성공적으로 조회된 경우 원격 데이터를 우선하며, 미동기화된 로컬 작성분만 스마트 병합
  let finalPlans: ClassroomBoardNote[] = [...remotePlans];
  if (localPlans.length > 0) {
    localPlans.forEach((lp) => {
      const existsInRemote = remotePlans.some(
        (rp) =>
          rp.studentName === lp.studentName &&
          rp.method === lp.method &&
          (rp.createdAt?.slice(0, 10) === lp.createdAt?.slice(0, 10) || rp.createdAt === lp.createdAt)
      );
      if (!existsInRemote) {
        finalPlans.push(lp);
      }
    });
  }

  let finalConcerns: ConcernNote[] = [...remoteConcerns];
  if (localConcerns.length > 0) {
    localConcerns.forEach((lc) => {
      const existsInRemote = remoteConcerns.some(
        (rc) =>
          rc.studentName === lc.studentName &&
          rc.situation === lc.situation &&
          (rc.createdAt?.slice(0, 10) === lc.createdAt?.slice(0, 10) || rc.createdAt === lc.createdAt)
      );
      if (!existsInRemote) {
        finalConcerns.push(lc);
      }
    });
  }

  return {
    plans: finalPlans,
    concerns: finalConcerns,
    isRemote: isRemoteSuccess,
    totalRemoteCount: totalCount,
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
