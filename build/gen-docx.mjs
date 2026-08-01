import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel,
  TableLayoutType, VerticalAlign, ShadingType
} from "docx";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const OUT_DIR = join(__dirname, "../src/statics/documents");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Helper: underline blank field
const blank = (width = 20) => "_".repeat(width);
const cell = (text, opts = {}) => new TableCell({
  children: [new Paragraph({ children: [new TextRun({ text, size: 24, ...opts })] })],
  verticalAlign: VerticalAlign.CENTER,
});
const headerCell = (text) => new TableCell({
  children: [new Paragraph({ children: [new TextRun({ text, size: 24, bold: true })] })],
  verticalAlign: VerticalAlign.CENTER,
  shading: { type: ShadingType.SOLID, color: "E8E8E8" },
});

// ============================================================
// 1. 附件B-业主身份公示模板
// ============================================================
function buildDoc1() {
  const blank15 = blank(15);
  const blank10 = blank(10);
  const blank30 = blank(30);
  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "关于业主身份确认情况的公示", bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `〔20${blank10}〕第${blank10}号`, size: 24 })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: `${blank15}小区全体业主：`, size: 24 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `根据《吉林省物业管理条例》及相关规定，${blank15}小区首次业主大会会议筹备组（以下简称"筹备组"）已完成业主身份确认工作，现将有关情况公示如下：`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "一、基本情况", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `小区名称：${blank15}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `坐落位置：${blank30}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `总户数：${blank10}户`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `总建筑面积：${blank10}平方米`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `二、业主清册`, bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `（详见附件《${blank15}小区业主清册》）`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "三、公示期限", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `公示期为 ${blank(6)}年${blank(3)}月${blank(3)}日 至 ${blank(6)}年${blank(3)}月${blank(3)}日，共计7日。`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "四、异议受理", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "业主如对上述公示内容有异议，请在公示期内以书面形式向筹备组提出，并提供相关证明材料。", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `异议受理地点：${blank30}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `联系人：${blank15}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `联系电话：${blank15}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `受理时间：${blank15}`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "五、其他事项", bold: true, size: 24 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "公示期满无异议或异议处理完毕后，上述业主清册即为最终确认结果，作为首次业主大会会议的依据。", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "特此公示。", size: 24 })] }),
    new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${blank15}小区首次业主大会会议筹备组`, size: 24 })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${blank(6)}年${blank(3)}月${blank(3)}日`, size: 24 })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: `附件：《${blank15}小区业主清册》`, size: 24 })] }),
  ];
  return new Document({ sections: [{ children }] });
}

// ============================================================
// 2. 附件C-候选人报名表模板
// ============================================================
function buildDoc2() {
  const r = (text) => new TableRow({ children: [headerCell(text[0]), cell(text[1])] });
  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "业主委员会候选人报名表", bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200 }, children: [new TextRun({ text: `填表日期：${blank(6)}年${blank(3)}月${blank(3)}日`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "一、基本信息", bold: true, size: 24 })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: [
        r(["姓名", blank(15)]),
        r(["性别", "□ 男  □ 女"]),
        r(["出生年月", `${blank(6)}年${blank(3)}月`]),
        r(["民族", blank(10)]),
        r(["政治面貌", blank(10)]),
        r(["学历", blank(10)]),
        r(["联系电话", blank(15)]),
        r(["身份证号", blank(20)]),
        r(["工作单位及职务", blank(30)]),
        r(["房号", blank(10)]),
        r(["建筑面积", `${blank(10)}㎡`]),
        r(["入住时间", `${blank(6)}年${blank(3)}月`]),
      ],
    }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "二、个人简历", bold: true, size: 24 })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell("起止时间"), headerCell("工作/学习单位"), headerCell("职务/专业")] }),
        ...Array.from({ length: 5 }, () => new TableRow({ children: [cell(blank(15)), cell(blank(20)), cell(blank(15))] })),
      ],
    }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "三、专业特长及资质", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（如法律、财务、工程、管理等专业背景，相关资格证书等）", size: 22, color: "666666" })] }),
    new Paragraph({ children: [new TextRun({ text: blank(50) })] }),
    new Paragraph({ children: [new TextRun({ text: blank(50) })] }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "四、参选动机及工作设想", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（简述参选业委会的原因、对小区管理的看法、当选后的工作计划等，500字以内）", size: 22, color: "666666" })] }),
    ...Array.from({ length: 5 }, () => new Paragraph({ children: [new TextRun({ text: blank(50) })] })),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "五、承诺声明", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "本人郑重承诺：", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "1. 以上所填内容真实、准确、完整；", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "2. 本人符合业主委员会候选人资格条件；", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "3. 本人不存在不得作为候选人的情形；", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "4. 本人自愿参选，遵守选举纪律；", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "5. 如当选，将认真履行职责，维护全体业主的合法权益。", size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `承诺人签字：${blank(20)}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `日期：${blank(6)}年${blank(3)}月${blank(3)}日`, size: 24 })] }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "六、自荐人或推荐人信息", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `自荐人签字：${blank(20)}`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `业主联名推荐（需${blank(3)}名以上业主）：`, size: 24 })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell("序号"), headerCell("推荐业主姓名"), headerCell("房号"), headerCell("联系电话"), headerCell("签字")] }),
        ...Array.from({ length: 5 }, (_, i) => new TableRow({ children: [cell(String(i + 1)), cell(blank(10)), cell(blank(8)), cell(blank(12)), cell(blank(10))] })),
      ],
    }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "七、筹备组审核意见", bold: true, size: 24 })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell("审核项目"), headerCell("审核结果")] }),
        new TableRow({ children: [cell("业主身份核实"), cell("□ 符合  □ 不符合")] }),
        new TableRow({ children: [cell("资格条件审查"), cell("□ 符合  □ 不符合")] }),
        new TableRow({ children: [cell("材料完整性"), cell("□ 齐全  □ 不齐全")] }),
        new TableRow({ children: [cell("审核结论", { bold: true }), cell("□ 同意列为候选人  □ 不同意", { bold: true })] }),
      ],
    }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `审核人签字：${blank(20)}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `审核日期：${blank(6)}年${blank(3)}月${blank(3)}日`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `备注：${blank(50)}`, size: 24 })] }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "附件：", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "1. 身份证复印件", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "2. 不动产权属证明复印件", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "3. 个人简历", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "4. 近期免冠照片2张", size: 24 })] }),
  ];
  return new Document({ sections: [{ children }] });
}

// ============================================================
// 3. 综合公示模板
// ============================================================
function buildDoc3() {
  const blank15 = blank(15);
  const blank10 = blank(10);
  const blank30 = blank(30);
  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "关于首次业主大会会议筹备事项的公示", bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `〔20${blank10}〕第${blank10}号`, size: 24 })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: `${blank15}小区全体业主：`, size: 24 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `根据《吉林省物业管理条例(2024修正)》第二十八条规定，${blank15}小区首次业主大会会议筹备组已完成首次业主大会会议的各项筹备工作，现将有关事项公示如下：`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "一、业主身份确认情况", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "经筹备组核实确认，本小区业主基本情况如下：", size: 24 })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell("项目"), headerCell("数据")] }),
        new TableRow({ children: [cell("总户数"), cell(`${blank10}户`)] }),
        new TableRow({ children: [cell("总建筑面积"), cell(`${blank10}平方米`)] }),
        new TableRow({ children: [cell("已入住户数"), cell(`${blank10}户`)] }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "（详细业主清册见附件1）", size: 22, color: "666666" })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "二、首次业主大会会议方案", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（一）会议时间", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `${blank(6)}年${blank(3)}月${blank(3)}日（星期${blank(3)}）${blank(3)}时${blank(3)}分`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（二）会议地点", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: blank30, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（三）会议形式", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "□ 现场会议", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "□ 书面征求意见", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "□ 现场会议与书面征求意见相结合", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（四）会议议程", bold: true, size: 24 })] }),
    ...["1. 宣布会议开始", "2. 报告筹备工作情况", "3. 审议《业主大会议事规则（草案）》", "4. 审议《管理规约（草案）》", "5. 选举业主委员会成员", "6. 宣布表决结果", "7. 宣布会议结束"].map(t => new Paragraph({ children: [new TextRun({ text: t, size: 24 })] })),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "三、业主大会议事规则草案", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `（详见附件2《${blank15}小区业主大会议事规则（草案）》）`, size: 22, color: "666666" })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "四、管理规约草案", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `（详见附件3《${blank15}小区管理规约（草案）》）`, size: 22, color: "666666" })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "五、首次业主大会会议表决规则", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（一）投票权确定", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 业主人数按专有部分数量计算，一个专有部分按一人计算", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 专有部分面积按不动产登记簿记载的面积计算", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（二）通过标准", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "一般事项（议事规则、管理规约、选举业委会等）：", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 参与表决的专有部分面积占总面积2/3以上且人数占总人数2/3以上", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 经参与表决专有部分面积过半数的业主且参与表决人数过半数的业主同意", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "特别事项（筹集维修资金、改建重建等）：", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 参与表决的专有部分面积占总面积2/3以上且人数占总人数2/3以上", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "· 经参与表决专有部分面积3/4以上的业主且参与表决人数3/4以上的业主同意", size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "六、业主委员会候选人产生办法", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（一）业委会职数", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `业主委员会由${blank(3)}名委员组成，其中主任1名、副主任${blank(3)}名。`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（二）候选人资格条件", bold: true, size: 24 })] }),
    ...["1. 本小区业主", "2. 具有完全民事行为能力", "3. 遵守法律法规和管理规约", "4. 热心公益，责任心强", "5. 具备必要的工作时间"].map(t => new Paragraph({ children: [new TextRun({ text: t, size: 24 })] })),
    new Paragraph({ children: [new TextRun({ text: "（三）候选人名单", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（详见附件4《业主委员会候选人名单》）", size: 22, color: "666666" })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "七、业主委员会选举办法", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（一）选举方式", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `采用差额选举方式，候选人${blank(3)}名，应选${blank(3)}名。`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（二）投票方式", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "现场投票与书面征求意见相结合。", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "（三）当选条件", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "经参与表决专有部分面积过半数的业主且参与表决人数过半数的业主同意。", size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "八、公示期限", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `公示期为 ${blank(6)}年${blank(3)}月${blank(3)}日 至 ${blank(6)}年${blank(3)}月${blank(3)}日，共计7日。`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "九、异议受理", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: "业主如对上述公示内容有异议，请在公示期内以书面形式向筹备组提出，并提供相关证明材料。", size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `异议受理地点：${blank30}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `联系人：${blank15}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `联系电话：${blank15}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `受理时间：${blank15}`, size: 24 })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "十、附件", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `1. 附件1：《${blank15}小区业主清册》`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `2. 附件2：《${blank15}小区业主大会议事规则（草案）》`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `3. 附件3：《${blank15}小区管理规约（草案）》`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `4. 附件4：《业主委员会候选人名单》`, size: 24 })] }),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "特此公示。", size: 24 })] }),
    new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${blank15}小区首次业主大会会议筹备组`, size: 24 })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${blank(6)}年${blank(3)}月${blank(3)}日`, size: 24 })] }),
  ];
  return new Document({ sections: [{ children }] });
}

// ============================================================
// 4. 授权委托书（房屋产权人授权他人全权处理业委会事务）
// ============================================================
function buildDoc4() {
  const b = (n) => blank(n);
  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "授权委托书", bold: true, size: 36 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `本人（委托人）${b(12)}（身份证号：${b(20)}），系双阳区碧桂园江山名筑小区 ${b(4)} 栋 ${b(3)} 单元 ${b(3)} 号房屋产权人，依法享有该房屋对应的业主权利。现全权委托 ${b(12)}（身份证号：${b(20)}）作为本人的代理人，代为处理与业主委员会相关的一切事务，包括但不限于：`, size: 24 })] }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "出席业主大会会议，代为行使表决权、选举权，签收并填写会议文件及选票，代为行使本人享有的其他业主权利。", size: 24 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "受托人在委托范围内所签署的文件及作出的意思表示，本人均予以承认，并承担相应法律责任。", size: 24 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "本委托书一式一份，自委托人签字之日起生效。", size: 24 })] }),
    new Paragraph({ spacing: { before: 480 }, children: [new TextRun({ text: `委托人（签字）：${b(20)}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `日期：${b(6)}年${b(3)}月${b(3)}日`, size: 24 })] }),
    new Paragraph({ spacing: { before: 360 }, children: [new TextRun({ text: `受托人（签字）：${b(20)}`, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `日期：${b(6)}年${b(3)}月${b(3)}日`, size: 24 })] }),
  ];
  return new Document({ sections: [{ children }] });
}

// Generate all
async function main() {
  const docs = [
    { fn: buildDoc1, name: "附件B-业主身份公示模板.docx" },
    { fn: buildDoc2, name: "附件C-候选人报名表模板.docx" },
    { fn: buildDoc3, name: "综合公示模板.docx" },
    { fn: buildDoc4, name: "授权委托书（业主授权参选业委会）.docx" },
  ];
  for (const d of docs) {
    const buf = await Packer.toBuffer(d.fn());
    writeFileSync(join(OUT_DIR, d.name), buf);
    console.log(`✅ ${d.name}`);
  }
  console.log(`\n输出目录: ${OUT_DIR}`);
}

main().catch(console.error);
