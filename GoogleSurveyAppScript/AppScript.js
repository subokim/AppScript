// 강사 지원 등록시 메일 알림_김수보
function onFormSubmit(e){
  //접수된 내용
  const applytime = e.values[0];
  const name = e.values[2];
  const email = e.values[3];
  const contents = e.values[7] + '\n'  //소속
        + e.values[8] + '\n'   // 세미나, 강의
        + e.values[13] + '\n'  // 타겟
        + e.values[14] + '\n'  // 포트폴리오
        + e.values[15] + '\n';  // 당부의말

  
  sendReplyMail(name, email); //메일 발신자에게 자동 메일 회신
  sendAlarmMail(applytime,name,contents); //관리자에게 메일 알림
}

function sendAlarmMail (v_applytime, v_name, v_content) {
  //관리자에게 보내는 알림 메일
  const recipients = ['test@test.co.kr'];
  
  const subject = '[OOO] 신규 강사 지원자 등록 알림'; // 이메일 제목
  const body = '새로운 강사가 다음과 같이 지원하였습니다.\n'
               + '링크를 확인해주세요! \n'
               + '* 지원일시 : ' + v_applytime + '\n'
               + '* 지원자명 : ' + v_name + '\n'
               + '* 상세내용 : [' + v_content + ']\n'; // 이메일 본문

  // 이메일 보내기
  recipients.forEach(recipient => {
    MailApp.sendEmail(recipient, subject, body);
  });
}

//강사신청을 해주신 분들께 감사메일을 보냅니다. by kimsubo
function sendReplyMail(v_name, v_email) {
  // 감사 메일 내용
  const subject = '[OOO] 지식 파트너를 지원해 주셔서 감사합니다.'; // 이메일 제목
  const hellosender = `안녕하세요, ${v_name}님 !`
  const body = hellosender + '\n' 
              + 'OOO의 지식파트너로 지원해주셔서 감사합니다.\n'
			        + '보내주신 지원서는 담당부서에 전달됩니다.\n\n'
              + '진행여부는 세부검토 후 일주일 이내로 회신드리겠습니다.\n'
              + '행복한 하루되세요.\n\n'; // 이메일 본문

  // 이메일 보내기
  MailApp.sendEmail(v_email, subject, body);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  return `${year}.${month}.${day}(${dayOfWeek})`;
}

//매일 아침 7시, 어제 신규로 신청한 강사를 모아서 보여줍니다. by kimsubo
function checkAndSendEmailByDaily() {
  // 스프레드시트와 시트 이름 설정
  const spreadsheetId = ''; // 여기에 스프레드시트 ID를 입력하세요.
  const sheetName = '설문지 응답 시트1'; // 여기에 시트 이름을 입력하세요.

  // 어제 날짜 설정
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // 어제 날짜로 설정
  const formattedDate = formatDate(yesterday);
  console.log(formattedDate);

  // 어제 데이터 필터링
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const newEntries = data.filter(row => {
    const timestamp = row[0]; // 날짜/시간 열 (첫 번째 열)에서 값을 가져옵니다.
    const entryDate = new Date(timestamp);
    return entryDate.toDateString() === yesterday.toDateString();
  });

  const recipients = ['test@test.co.kr']

  // 새로운 데이터가 있으면 메일 보내기
  if (newEntries.length > 0) {  
    const subject = '[OOO] 일일 강의 지원자 알림('+ formattedDate + ') - ' + String(newEntries.length) + '명'; // 이메일 제목
    const body = '다음과 같이 새로운 강사가 지원을 했습니다. \n\n'
                  + '링크를 확인해주세요! \n\n'
                  + '* 기준일자 : ' + formattedDate + '\n'
                  + '* 지원자수 : ' + String(newEntries.length) + '명 \n'; // 이메일 본문

    // 이메일 보내기
    recipients.forEach(recipient => {
      MailApp.sendEmail(recipient, subject, body);
    });
  } else {
    const subject = '[OOO] 일일 강의 지원자 알림('+ formattedDate + ') - 0명'; // 이메일 제목
    const body = '새로 지원한 강사가 없습니다. \n\n'
                  + '링크를 확인해주세요! \n\n'
                  + '* 기준일자 : ' + formattedDate + '\n'
                  + '* 지원자수 : 0 명\n'; // 이메일 본문

    // 이메일 보내기
    recipients.forEach(recipient => {
      MailApp.sendEmail(recipient, subject, body);
    });
  }
}