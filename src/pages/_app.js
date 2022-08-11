import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { BsDownload } from "react-icons/bs";
// import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer';

var csv = [];
var row = [];

const fileTypes = ['TXT'];

//체크박스에 데이터를 추가/삭제 하고싶다면 이 부분만 변경하면 됨
const data = [
  { id: 0, title: '전화번호', found: 0, checked: true },
  { id: 1, title: '이메일', found: 0, checked: true },
  { id: 2, title: '주민등록번호', found: 0, checked: true },
  { id: 3, title: '나이', found: 0, checked: true },
  { id: 4, title: '날짜', found: 0, checked: true },
  { id: 5, title: '사업자등록번호', found: 0, checked: true },
  { id: 6, title: '은행명', found: 0, checked: true },
]

//정규식
var regPhone = new RegExp(/01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}/);
var regEmail = new RegExp(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}/i);
var regRRN = new RegExp(/([0-9]{2}(?:0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))-?[1-4][0-9]{6}/i);
var regAge = new RegExp(/([0-9]{0,4}((?=세)|(?=살)|(?=생)))/);
var regDay = new RegExp(/((19[0-9][0-9]|20\d{2})(?=년))|((0?[1-9]|1[0-2])(?=월))|(0?([1-9]|[1-2][0-9]|3[0-1])(?=일))/);
var regCor = new RegExp(/([0-9]{3})-?([0-9]{2})-?([0-9]{5})/);
var regBank = new RegExp(/([가-힣]+|[a-z]+|[A-Z]+)(?=은행)/);

const Converter = () => {
  const [checkItems, setCheckItems] = useState([]);
  // const [file, setFile] = useState(null);
  const handleChange = (file) => {
    // setFile(file);
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input = file;
    console.log(input);
    processFile(input);
  };

  //단일 체크박스 체크/해제 되었을 때
  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckItems(prev => [...prev, id]);
      data[id].checked = true;
      userSelectionTotal();
    } else {
      setCheckItems(checkItems.filter((el) => el !== id));
      data[id].checked = false;
      userSelectionTotal();
    }
  };

  //체크박스 전체선택/해제 되었을 때
  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = [];
      data.forEach((el) => idArray.push(el.id));
      setCheckItems(idArray);
      data.forEach((el) => el.checked = true);
    }
    else {
      setCheckItems([]);
      data.forEach((el) => el.checked = false);
    }
    userSelectionTotal();
  }

  //'변환하기'를 눌렀을 때 실행되는 함수
  //fn_submit()에서 엔터 기준으로 자른 뒤 convert에서 띄어쓰기 기준으로 파싱
  function fn_submit() {
    var name = '';
    handleAllCheck(false);

    row = [];
    csv = [];

    for (let j = 0; j < 7; j++) {
      data[j].found = 0;
    }

    var text = document.getElementById('text').value;
    var enter = text.split("\n");

    for (let i = 0; i < enter.length; i++) {
      name = name + convert(enter[i]) + '\n';
    }
    document.getElementById("result").innerText = name;
  }

  // 띄어쓰기 기준으로 자른 단어들에 대해, 
  // 일치하는 정규식이 있다면 해당 정보를 *로 마스킹하고 변환 로그에 추가
  // 하나라도 해당 개인정보가 있다면 체크박스 'checked'로 변경, 하나도 없다면 비활성화(비활성화 하는 코드는 )
  function convert(enter) {
    var name = '';
    var arr = enter.split(" ");

    for (let i = 0; i < arr.length; i++) {
      arr[i].split("\n").join(" ");
      var converted = '';

      if (regPhone.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 0);
        data[0].found = 1;
      }
      else if (regEmail.test(arr[i]) === true) {
        converted = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        csvGenerator(arr[i], converted);

        arr[i] = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        handleSingleCheck(true, 1);
        data[1].found = 1;
      }
      else if (regRRN.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 2);
        data[2].found = 1;
      }
      else if (regAge.test(arr[i]) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 3);
        data[3].found = 1;
      }
      else if (regDay.test(arr[i].replaceAll(" ", "")) === true) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 4);
        data[4].found = 1;
      }
      else if (regCor.test(arr[i]) === true) {
        if (CorporateRegNumCheck(arr[i])) {
          converted = arr[i].replace(/[0-9]/gi, '*');
          csvGenerator(arr[i], converted);

          arr[i] = converted;
          handleSingleCheck(true, 5);
          data[5].found = 1;
        }
      }
      else if (regBank.test(arr[i]) === true) {
        converted = "**은행"
        csvGenerator(arr[i], converted);

        arr[i] = converted;
        handleSingleCheck(true, 6);
        data[6].found = 1;
      }
      name += arr[i];
      name += ' ';
    }
    return name;
  }

  //fn_submit()과 같은 동작을 하는 함수, 체크박스 선택 / 해제에 따라서 실시간으로 변환 결과 바꾸는 코드
  function userSelectionTotal() {
    csv = [];

    var changed = '';
    var text = document.getElementById('text').value;
    var enter = text.split("\n");

    for (let i = 0; i < enter.length; i++) {
      changed = changed + userSelection(enter[i]) + '\n';
    }
    document.getElementById("result").innerText = changed;
  }

  //convert()와 같은 동작
  function userSelection(enter) {
    var name = '';
    var converted = '';
    var arr = enter.split(' ');

    row = [];

    for (let i = 0; i < arr.length; i++) {
      if (regPhone.test(arr[i]) && data[0].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regEmail.test(arr[i]) && data[1].checked) {
        converted = arr[i].replace(/[a-zA-Z0-9]/g, "*");
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regRRN.test(arr[i]) && data[2].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regAge.test(arr[i]) && data[3].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regDay.test(arr[i]) && data[4].checked) {
        converted = arr[i].replace(/[0-9]/gi, '*');
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else if (regCor.test(arr[i]) && data[5].checked) {
        if (CorporateRegNumCheck(arr[i])) {
          converted = arr[i].replace(/[0-9]/gi, '*');
          csvGenerator(arr[i], converted);
          arr[i] = converted;
        }
      }
      else if (regBank.test(arr[i]) && data[6].checked) {
        converted = "**은행";
        csvGenerator(arr[i], converted);
        arr[i] = converted;
      }
      else {
        converted = '';
      }
      name += arr[i];
      name += ' ';
    }
    return name;
  }

  //사업자등록번호는 아래의 형식을 만족해야 사업자 등록번호로 인정함.
  //그냥 숫자 10자리로는 통과할 수 없음. 유효한 사업자번호임을 체크.
  function CorporateRegNumCheck(number) {
    var numMap = number.replace(/-/gi, '').split('').map(function (d) {
      return parseInt(d, 10);
    });
    if (numMap.length === 10) {
      var keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
      var check = 0;

      keyArr.forEach(function (d, i) {
        check += d * numMap[i];
      });

      check += parseInt((keyArr[8] * numMap[8]) / 10, 10);
      return Math.floor(numMap[9]) === ((10 - (check % 10)) % 10);
    }
    return false;
  }

  //csv 파일 생성
  function csvGenerator(a, b) {
    row.push("'" + a, b);

    csv.push(row.join(","));
    row.splice(0, row.length);
    csv.join("\n");
  }

  //csv 파일 다운로드
  function downloadCsv() {
    csv = csv.join("\n");
    let filename = "test.csv";

    var csvFile;
    let downloadLink;
    const BOM = "\uFEFF";
    csv = BOM + csv;

    csvFile = new Blob([csv], { type: "text/csv" });

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    userSelectionTotal();

  }

  //txt 파일을 업로드하는 기능
  // function openTextFile() {
  //   var input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = ".txt";

  //   input.onchange = function (event) {
  //     processFile(event.target.files[0]);
  //   };

  //   input.click();
  // }

  //txt 파일을 FileReader()로 읽어와 input 박스에 넣어주는 함수
  function processFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      document.getElementById('text').value = reader.result;
    };
    reader.readAsText(file, "UTF-8");
  }

  //txt 파일 다운로드
  function downloadTxt() {
    var fileName = "test.txt";
    var content = document.getElementById('result').innerText;

    var blob = new Blob([content], { type: "text/plain" });
    let downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    userSelectionTotal();
  }


  return (
    <div>
      <header className={styles.header}>
        BATONERS CONVERTER
      </header>
      <div class="container overflow-hidden">
        <div class="row">
          <div class="col-md">
            <div className={styles.input_container}>
              <div className={styles.drop_zone}>
                <div class="drop-zone">
                  <FileUploader
                    multiple={false}
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    children={<div className={styles.upload_box}><p>Upload or drop a file</p></div>}
                  />
                </div>
              </div>
              <textarea name="text" id="text" placeholder="여기에 입력" className={styles.input_box}></textarea>
              <button type="submit" onClick={fn_submit} className={styles.button}>변환하기</button>
            </div>
          </div>

          <div class="col-md">
            <div className={styles.output_container}>
              <div id="result" className={styles.output_box}></div>
              <div className={styles.output_option_box}>
                <div className={styles.output_option_box_top}>
                  <div className="form-check">
                    <input class="form-check-input" type='checkbox' name='select-all'
                      onChange={(e) => handleAllCheck(e.target.checked)}
                      checked={checkItems.length === data.length ? true : false} />
                    <label className='form-check-label'>전체선택</label>
                  </div>
                </div>
                <div className={styles.output_option_box_bottom}>
                  {data?.map((data, key) => (
                    <div key={key}>
                      <div className="form-check">
                        <input className="form-check-input" type='checkbox' name={`select-${data.id}`}
                          onChange={(e) => handleSingleCheck(e.target.checked, data.id)}
                          checked={checkItems.includes(data.id) && data.found === 1 ? true : false}
                          disabled={data.found === 1 ? false : true} />
                        <label className='form-check-label'>{data.title}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.button_container}>

                <button type="submit" onClick={downloadCsv} className={styles.button_inline}><BsDownload/> 변환내역 csv로 다운로드</button>
                <button type="submit" onClick={downloadTxt} className={styles.button_inline}><BsDownload/> 변환파일 txt로 다운로드</button>
                {/* <button type="submit" id="hi" onClick={Input} className={styles.button_rev}>pdf 파일 다운로드</button> */}

              </div>
            </div>
          </div>
        </div>

      </div>
      <footer className={styles.footer}>
      </footer>
    </div>
  );

}

export default Converter;