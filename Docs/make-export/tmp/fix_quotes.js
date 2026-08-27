const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/imports/HomeDesktop.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace first occurrence (line 975)
content = content.replace(
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[rgba(18,21,14,0.71)] w-[352px] whitespace-pre-wrap text-[18px]">\"They delivered in two weeks what would have taken us months. The site brought in real leads from day one.\"</p>`,
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[rgba(18,21,14,0.71)] w-[280px] whitespace-pre-wrap text-[16px]">\"They delivered in two weeks what would have taken us months. The site brought in real leads from day one.\"</p>`
);

// Replace second occurrence (line 1058)
content = content.replace(
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[18px] text-[rgba(18,21,14,0.71)] w-[352px] whitespace-pre-wrap">{\`\"Finally, a team that understands both design and business. Our conversion rate jumped 40% in the first month.\"\`}</p>`,
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[16px] text-[rgba(18,21,14,0.71)] w-[280px] whitespace-pre-wrap">{\`\"Finally, a team that understands both design and business. Our conversion rate jumped 40% in the first month.\"\`}</p>`
);

// Replace third occurrence (line 1121)
content = content.replace(
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[18px] text-[rgba(18,21,14,0.71)] w-[352px] whitespace-pre-wrap">{\`\"They turned our rough idea into a pitch deck that impressed investors. Professional, fast, and honest.\"\`}</p>`,
  `<p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[16px] text-[rgba(18,21,14,0.71)] w-[280px] whitespace-pre-wrap">{\`\"They turned our rough idea into a pitch deck that impressed investors. Professional, fast, and honest.\"\`}</p>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated successfully');
