## 기능 소개
* 어학공부용 어플
* 해당 표현 검색을 통해 원어민들이 실제로 그 표현을 어떻게 사용하는지 학습할 수 있음
* 윈도우, Mac OS, 리눅스 모두 지원

## 단축키
* 앞/뒤 이동
  - z - 7초 뒤로
  - x - 5초 뒤로
  - c - 3초 뒤로
  - v - 1초 뒤로
  - n - 5초 앞으로
  - m - 10초 앞으로
  - , - 15초 앞으로
* g - 최근 선택 지점으로 이동
* b - 선택 지점 변경
* s - 자막 켜기/끄기
* 스페이스 - 일시정지

## 사용법
1. 준비단계
  - smi 자막 파일이면 srt로 변경해야 함
      * [smi를 srt로 변환해주는 사이트](http://smisrt.com/)를 이용하여 srt 생성 가능
  - 영상을 재생하려면 webm 포맷의 영상이 필요함 
      * [카카오 인코더](http://www.cacaotools.com/cacaoencoder/)를 이용하여 webm 포맷으로 변경 가능
  - 영상이름과 자막파일 이름이 같아야 하고 영상과 자막은 같은 폴더에 있어야 함
2. Set Search Folder 클릭하여 검색할 자막이 있는 폴더 설정
  - 예시1) 미드1 시즌1을 대상으로 검색하고자 할 때, "비디오/미드1/시즌1" 폴더 선택
  - 예시2) 미드1 전시즌을 대상으로 검색하고자 할 때 "비디오/미드1" 폴더 선택
  - 예시3) 모든 미드 대상으로 검색하고자 할 때 "비디오" 폴더 선택
3. 영어 표현 검색
  - 단어 및 구문 검색
  - 단어들이 바로 붙어 있지 않은 구문 검색 가능 (정규표현식 사용)
     * 예시) pick me up, pick him up 등 pick up이 사용된 표현을 검색하고자 할 때 검색어로 pick과 up 사이에 .*를 추가한다. 
     즉, pick.*up으로 검색함. 세 개이상의 단어로 이루어진 구문도 단어사이에 .*를 넣어주면 됨 
4. 단축키를 이용하여 영상 컨트롤 가능. 단축키 섹션 참고.

## 제약사항
* 영어 표현 검색시 srt 자막 파일만 지원
  - [smi를 srt로 변환해주는 사이트](http://smisrt.com/)를 이용하여 srt 생성 가능
* 현재 webm 포맷 영상만 지원
  - [카카오 인코더](http://www.cacaotools.com/cacaoencoder/)를 이용하여 webm 포맷으로 변경 가능
* 영상과 자막을 같이 볼 때 자막은 WebVTT파일만 지원
  - srt를 WebVTT로 바꿔서 같은 폴더에 저장해 놓아야 함
  - [srt를 WebVTT로 변환해주는 사이트](https://atelier.u-sub.net/srt2vtt/)

## Thanks to
* [Electron](http://electron.atom.io/)
* [subtitles-parser](https://github.com/bazh/subtitles-parser)
