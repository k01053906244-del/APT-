import { NotebookItem } from '../types';

export const notebookDB: Record<string, NotebookItem> = {
  policy: {
    title: "📉 뷰빈 부동산 정책 및 시장 분석",
    subtitle: "노트북LM 핵심 데이터 및 금리 보정 스프레드",
    content: `
      <div class="space-y-4 text-left">
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-1">
          <span class="text-xs text-[#f2ca50] font-bold">1단계: DSR 규제 극복 (수도권 1.2%p 가산금리 대응)</span>
          <p class="text-sm text-white font-bold">LTV 최대 확보 및 거치 한도 보정</p>
          <p class="text-xs text-slate-300 leading-relaxed">스트레스 DSR 2단계 도입으로 대출 한도가 10~15% 축소됨에 따라, 입주 시점에 신축 잔금대출의 한도 규제를 우회하기 위한 조치입니다. 거치형 및 분할상환 최적 비율 설정을 통해 실질 DSR 한도를 보정하는 설계가 필수로 요구됩니다.</p>
        </div>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-1">
          <span class="text-xs text-[#f2ca50] font-bold">2단계: 황금 마진 스프레드 (Spread) 확보 공법</span>
          <p class="text-sm text-white font-bold">이율 5.0% 대비 전환율 6.0%의 마진 극대화</p>
          <p class="text-xs text-slate-300 leading-relaxed">대출 이율이 5%일 때 월세 전환율을 6%로 설정하면, 1%p의 무위험 스프레드 마진을 취득할 수 있습니다. 즉, 대출을 많이 받을수록 은행 이자를 상쇄하고도 대표님께 매달 잉여 월세 흐름이 축적되는 황금 비율 구간입니다.</p>
        </div>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-1">
          <span class="text-xs text-[#f2ca50] font-bold">3단계: 입주 물량 덤핑 방어 (팰루시드 등 초기 선점론)</span>
          <p class="text-sm text-white font-bold">입주 개시 초기 2주 골든타임 선점</p>
          <p class="text-xs text-slate-300 leading-relaxed">대단지 신축 입주 지정 기간(통상 2개월) 중 후반부로 갈수록 공실을 우려한 임대인들의 가격 덤핑 투매가 쏟아집니다. 초반 2주 이내에 1.3억/150만 조건으로 계약을 매듭짓는 것이 가장 안전한 최선책입니다.</p>
        </div>
      </div>
    `
  },
  'special-contract': {
    title: "📜 전세권 설정 등기 특약 법적 효력 & 방어 전략",
    subtitle: "선순위 대출 수호 및 지정 법무사 동시이행 완납 공법",
    content: `
      <div class="space-y-4 text-left">
        <div class="bg-[#7dffa2]/5 p-4 rounded-xl border border-[#7dffa2]/20 space-y-1">
          <span class="text-xs text-[#7dffa2] font-bold">법적 효력: 선순위 근저당권 보존</span>
          <p class="text-sm text-white font-bold">임대인의 기존 주담대를 훼손하지 않는 철저한 방어 조항</p>
          <p class="text-xs text-slate-300 leading-relaxed">세입자가 전세권 설정을 요구할 때, 대표님의 주담대(1순위 근저당)의 선순위 권리를 안전하게 보존하면서도 세입자를 안심시키고 동시이행 입주를 시키는 핵심 전략입니다.</p>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-2">
          <span class="text-xs text-[#7dffa2] font-bold block">★ 계약서 탑재용 실제 특약 조항문 (박스 터치 시 자동 복사)</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] select-all cursor-pointer leading-relaxed border border-[#f2ca50]/20" id="copy-target-special">
            임대인은 임차인의 잔금 지급과 동시에 기존 주택담보대출 잔액 중 일부를 상환/감액 등기하며, 해당 절차는 임차인 지정 수임 법무사를 통해 동시이행한다. 임대인은 당일 대출 완납증명서 및 등기 말소 접수증을 즉시 교부하여 완납 사실을 증명하기로 한다.
          </div>
          <span class="text-[10px] text-slate-400 block">*위 노란색 상자를 터치하시면 특약 문구가 자동으로 복사됩니다.</span>
        </div>
        <div class="bg-[#7dffa2]/5 p-4 rounded-xl border border-[#7dffa2]/20 space-y-1">
          <span class="text-xs text-[#7dffa2] font-bold">3대 리스크 헤징(Hedging) 룰</span>
          <ul class="text-xs text-slate-300 list-disc pl-4 space-y-1.5 mt-1 leading-relaxed">
            <li><strong>동시이행 명시</strong>: 잔금일에 중개업소와 법무사가 현장에서 대출 은행 창구에 상환 처리를 확인하는 안전장치 필수.</li>
            <li><strong>전세권 범위 제한</strong>: 아파트 공용 및 대지 부분에 대해 임대인의 처분권을 침해하지 않도록 범위를 전용부분으로 제한.</li>
            <li><strong>자동 말소 조항</strong>: 만기 퇴거와 동시에 전세권 말소 서류 일체를 임대인에게 반환하며, 미이행 시 발생하는 연체 책임을 세입자에게 귀속시킴.</li>
          </ul>
        </div>
      </div>
    `
  },
  bathroom: {
    title: "🚽 [욕실/발코니] 배수구 타일 구배 집중 점검법",
    subtitle: "사전점검 필수 체크포인트 및 시공사 제출 보고 양식",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed">
          욕실과 발코니는 세입자가 거주하면서 가장 많은 누수 및 곰팡이 하자를 민원으로 제기하는 단골 구역입니다. 타일 경사(구배)가 낮으면 물이 고여 배수되지 않는 중대 하자가 됩니다.
        </p>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🔍 실전 자가 점검 순서</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>종이컵 테스트</strong>: 물이 고이는 구석 자리에 종이컵 한 컵의 물을 붓고 5분 뒤 흘러내리는지 체크.</li>
            <li><strong>샤워기 분사 테스트</strong>: 바닥 전체에 샤워기로 물을 고르게 뿌린 뒤 배수구 방향으로 신속하게 흘러 들어가는지 육안 확인.</li>
            <li><strong>타일 빈소리 체크</strong>: 사전점검봉으로 타일을 가볍게 두드렸을 때 내부가 빈 소리가 나는 곳이 없는지 점검 (들뜸 하자 예방).</li>
          </ul>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-1.5">
          <span class="text-xs text-[#f2ca50] font-bold"> 시공사 공식 하자 보수 접수 양식</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] leading-relaxed border border-[#f2ca50]/10">
            안방 욕실 및 발코니 배수구 주변 바닥 타일 구배 불량으로 인해 물이 고여 원활하게 배수되지 않는 하자가 발견되었습니다. 입주 지정 기간 개시 전까지 재시공 및 보수를 요청합니다.
          </div>
        </div>
      </div>
    `
  },
  kitchen: {
    title: "🍳 [주방/다용도실] 하부장 누수 및 가전 밀착 점검법",
    subtitle: "사전점검 필수 체크포인트 및 시공사 제출 보고 양식",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed">
          싱크대 하부장은 눈에 잘 띄지 않아 놓치기 쉬우나, 미세한 연결 부위 누수가 지속되면 하부 씽크볼 목재가 썩거나 아래층 천장 누수라는 대형 사고로 번지게 됩니다.
        </p>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🔍 실전 자가 점검 순서</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>수압 및 배수 동시 테스트</strong>: 싱크볼에 물을 가득 담은 뒤 한 번에 내려서 배수 호스 연결 틈새로 미세하게 새어 나오는 물방울이 없는지 휴지로 닦으며 체크.</li>
            <li><strong>난방 배관 온수 확인</strong>: 하부장 내부 싱크대 온수 분배기 밸브 주변에 미세한 물 흔적이나 녹슨 현상이 없는지 확인.</li>
            <li><strong>인덕션/식기세척기 작동</strong>: 빌트인 옵션 가전의 전원 인입 및 콘센트 단선 여부 직접 터치 점검.</li>
          </ul>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-1.5">
          <span class="text-xs text-[#f2ca50] font-bold"> 시공사 공식 하자 보수 접수 양식</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] leading-relaxed border border-[#f2ca50]/10">
            주방 씽크대 하부장 내부 배수 호스 연결 틈새 누수 흔적이 발견되었으며, 온수 분배기 결속 불량으로 인해 미세 누수 우려가 있으니 신속한 결속 보강 및 재확인을 요청합니다.
          </div>
        </div>
      </div>
    `
  },
  window: {
    title: "🪟 [창호/새시] 개폐 결속 및 풍지판 완벽 점검법",
    subtitle: "사전점검 필수 체크포인트 및 시공사 제출 보고 양식",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed">
          신축 아파트에서 흔히 발견되는 틈새 바람과 창틀 결로의 주범은 바로 새시 사이의 '풍지판(바람막이 플라스틱 캡)' 누락입니다. 겨울철 세입자 클레임을 방지하는 핵심 구역입니다.
        </p>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🔍 실전 자가 점검 순서</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>창문 잠금 결속 점검</strong>: 크리센트(손잡이)를 돌려 창호가 유격 없이 꽉 닫히고 프레임과 완벽하게 잠기는지 좌우 흔들며 체크.</li>
            <li><strong>하부 풍지판 유무 체크</strong>: 베란다 이중창 상하단 레일 모퉁이에 모헤어가 부착된 풍지판 덮개가 누락되었는지 전수 확인.</li>
            <li><strong>외벽 새시 코킹 점검</strong>: 외부 새시 실리콘 코킹 마감이 뜯겨 비바람이 들어올 틈새가 없는지 꼼꼼히 확인.</li>
          </ul>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-1.5">
          <span class="text-xs text-[#f2ca50] font-bold"> 시공사 공식 하자 보수 접수 양식</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] leading-relaxed border border-[#f2ca50]/10">
            거실 및 다용도실 이중창 하부 레일 모퉁이의 풍지판(바람막이 캡) 부품이 누락되어 틈새 바람이 심하게 발생하오니 정품 풍지판 부착 및 레일 고무 밀착 보수를 바랍니다.
          </div>
        </div>
      </div>
    `
  },
  entrance: {
    title: "🚪 [현관/거실] 도어락 및 아트월 들뜸 집중 점검법",
    subtitle: "사전점검 필수 체크포인트 및 시공사 제출 보고 양식",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed">
          현관문과 거실은 아파트의 얼굴이자 임차인이 입주할 때 가장 먼저 평가하는 영역입니다. 도어락 작동 하자나 아트월 타일 들뜸은 계약 신뢰도 저하를 부르는 위험 요인입니다.
        </p>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🔍 실전 자가 점검 순서</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>문틀 고무 패킹 확인</strong>: 현관문을 닫았을 때 고무 패킹이 헐거워 외부 소음이나 바람이 완충되지 않고 새는지 밀착력 점검.</li>
            <li><strong>아트월 타일 두드림</strong>: 거실 대형 타일(아트월) 표면을 가볍게 골고루 두드려 내부 시멘트 밥 들뜸 현상 유무 점검.</li>
            <li><strong>바닥 강마루 들뜸 밟기</strong>: 거실 및 복도 동선 바닥 강마루 결함을 밟았을 때 서걱거리는 소리나 밟히는 유격 느낌이 없는지 체중 확인.</li>
          </ul>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-1.5">
          <span class="text-xs text-[#f2ca50] font-bold"> 시공사 공식 하자 보수 접수 양식</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] leading-relaxed border border-[#f2ca50]/10">
            현관 도어락 문틀 밀착 패킹 간극 유격으로 외부 풍음이 가중되며, 거실 중앙 좌측 아트월 타일의 경미한 들뜸(둥글게 빈소리 발생) 하자가 있으므로 완벽 보수를 희망합니다.
          </div>
        </div>
      </div>
    `
  },
  balcony: {
    title: "🌿 [발코니/세탁실] 탄성코트 페인트 균열 및 기기 점검법",
    subtitle: "사전점검 필수 체크포인트 및 시공사 제출 보고 양식",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed">
          베란다와 세탁실 공간은 동절기 결로로 인해 탄성코트(기능성 페인트)가 부풀어 오르거나 벗겨지는 크랙 하자 분쟁이 빈번합니다. 사전 밀폐와 방수 상태 확인이 최고의 보험입니다.
        </p>
        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🔍 실전 자가 점검 순서</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>탄성코트 크랙 점검</strong>: 세탁실 구석 및 우수관 주변 페인트 도포면에 들뜸, 균열, 변색 흔적이 없는지 확인.</li>
            <li><strong>빨래 건조대 수동/전동 작동</strong>: 전동 빨래건조대의 등기구 작동 상태 및 하강/상승 조절 소음 유격 체크.</li>
            <li><strong>수도 수전 결합 확인</strong>: 세탁기 온/냉수 수전 밸브 핸들이 유격 없이 고정되어 있으며 미세 누수가 생기지 않는지 체크.</li>
          </ul>
        </div>
        <div class="p-4 bg-[#201f1f] rounded-xl border border-white/5 space-y-1.5">
          <span class="text-xs text-[#f2ca50] font-bold"> 시공사 공식 하자 보수 접수 양식</span>
          <div class="bg-black/40 p-3 rounded font-mono text-[11px] text-[#f2ca50] leading-relaxed border border-[#f2ca50]/10">
            세탁실 안쪽 모서리 우수관 배수 천장 마감 주변 탄성코트 균열 및 도포 박리 현상이 미세 식별되어 입고 전 시공사 보강 도장을 요긴하게 신청합니다.
          </div>
        </div>
      </div>
    `
  },
  'required-docs': {
    title: "📋 신축 아파트 입주 & 금융 레버리지 필수 구비서류 체크리스트",
    subtitle: "잔금대출·소유권 이전 등기·임대 계약의 완벽 행정 대응",
    content: `
      <div class="space-y-4 text-left">
        <p class="text-xs text-slate-300 leading-relaxed font-semibold">
          신축 아파트 잔금 및 소유권 확보 과정에서 행정적 지연 없이 한 번에 심사를 통과하기 위한 최고 수준의 원스톱 서류 패키지 정보입니다. 대표님이 자문을 직접 받거나 은행·법무사에 지참하여 제출하는 용도입니다.
        </p>

        <div class="bg-[#f2ca50]/5 p-4 rounded-xl border border-[#f2ca50]/20 space-y-2">
          <span class="text-xs text-[#f2ca50] font-bold block">🏦 1. 주택담보대출 (잔금대출) 조달 패키지 (Leverage Financing Documents)</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>본인 확인</strong>: 주민등록등본 2부, 주민등록초본(과거 주소 변동 이력 전체포함 상세본) 2부</li>
            <li><strong>소득 확인</strong>: 근로소득원천징수영수증 2개년분(회사 직인 포함) 또는 소득금액증명원(최근 2년) 1부</li>
            <li><strong>재직 증명</strong>: 재직증명서(근로자) 또는 사업자등록증 및 사업자등록증명원(개인사업자) - 최근 1개월 이내 발급분</li>
            <li><strong>자격 권리</strong>: 아파트 분양계약서 원본(분양 계약서 본책) 및 별도 옵션 계약서 원본 일체 및 발코니 확장 계약서 원본</li>
            <li><strong>기타 증명</strong>: 인감증명서(금융기관 대출용) 2부, 인감도장 및 통장인감, 신분증 원본</li>
          </ul>
        </div>

        <div class="bg-[#7dffa2]/5 p-4 rounded-xl border border-[#7dffa2]/20 space-y-2">
          <span class="text-xs text-[#7dffa2] font-bold block">⚖️ 2. 소유권 이전 등기 및 감액 등기용 (Ownership Transfer Registration)</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>매수 주체 서류</strong>: 잔금 완납증명서 원본(시공사·시행사 발급분) 및 입금증 사본</li>
            <li><strong>행정 등록 서류</strong>: 주민등록등본(주민번호 공개) 1부, 주민등록초본(상세) 1부 (전체 이력 주소 변동 내역)</li>
            <li><strong>가족 관계</strong>: 가족관계증명서(상세) 1부 (취득세 1주택/다주택 판정을 위해 대행 법무사 법인 제출 필수)</li>
            <li><strong>등기 대행 위임</strong>: 등기 위임장 서명 및 인감도장 날인 (현장 단지 협약 법무사 사무장 대응)</li>
          </ul>
        </div>

        <div class="bg-blue-500/5 p-4 rounded-xl border border-blue-400/20 space-y-2">
          <span class="text-xs text-blue-400 font-bold block">🤝 3. 반전세 신규 계약 체결 시 임대인 구비서류 (Tenancy Compliance)</span>
          <ul class="text-xs text-slate-300 list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li><strong>안심 보장 서류</strong>: 지방세 납세증명서 및 국세 납세증명서 (대표님의 전월세 매물 세입자가 대항력을 지키거나 임차인 대출 적합 심사용)</li>
            <li><strong>권리 자격</strong>: 아파트 공급계약서 및 옵션 계약 사본 (미등기 주택이므로 소유권 증빙 대안 제출)</li>
            <li><strong>잔금 수금</strong>: 분양 잔금 영수증 및 중도금 완납 확인서 (임차인 안심 전세대출 가심사 승인 및 본 심사 필수 요구서류)</li>
          </ul>
        </div>
      </div>
    `
  }
};
