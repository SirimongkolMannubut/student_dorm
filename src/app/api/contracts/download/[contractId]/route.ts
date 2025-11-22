import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const contractId = params.contractId;
    
    const contracts = global.contracts || [];
    const contract = contracts.find((c: any) => c.id === contractId);
    
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const users = global.users || new Map();
    const userArray = Array.from(users.values());
    const user = userArray.find((u: any) => u.studentId === contract.studentId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const contractContent = generateContractHTML(contract, user);
    
    return new NextResponse(contractContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="สัญญาเช่า_${contractId}.html"`
      }
    });
    
  } catch (error) {
    console.error('Error generating contract:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateContractHTML(contract: any, user: any) {
  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const contractDate = new Date();
  
  return `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>สัญญาเช่าห้องพัก - ${contract.id}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }
        .content { text-align: justify; margin: 15px 0; }
        .clause { margin: 15px 0; }
        .signature-section { margin-top: 40px; }
        .signature-row { display: flex; justify-content: space-between; margin: 30px 0; }
    </style>
</head>
<body>
    <div style="text-align: right;">เลขที่ ${contract.id}/${contractDate.getFullYear() + 543}</div>
    
    <div class="title">สัญญาเช่าห้องพัก (หอพักนักศึกษา มหาวิทยาลัยราชภัฏศรีสะเกษ)</div>
    
    <div class="content">
        ทำที่ มหาวิทยาลัยราชภัฏศรีสะเกษ<br>
        วันที่ ${contractDate.getDate()} เดือน ${getThaiMonth(contractDate.getMonth())} พ.ศ. ${contractDate.getFullYear() + 543}
    </div>
    
    <div class="content">
        สัญญาทำขึ้นระหว่าง หอพักนักศึกษา มหาวิทยาลัยราชภัฏศรีสะเกษ อยู่บ้านเลขที่ 319 หมู่ที่ 8 ถนน ไทยพันทา ตำบล โพธิ์ 
        อำเภอเมือง จังหวัดศรีสะเกษ ซึ่งต่อไปในสัญญานี้จะเรียกว่า "ผู้ให้เช่า" ฝ่ายหนึ่ง กับ <strong>${user.fullName}</strong><br>
        รหัสนักศึกษา <strong>${user.studentId}</strong> เบอร์โทรศัพท์ <strong>${user.phone}</strong><br>
        ซึ่งต่อไปในสัญญานี้จะเรียกว่า "ผู้เช่า" อีกฝ่ายหนึ่ง
    </div>
    
    <div class="clause">
        <strong>ข้อ 1. ทรัพย์ที่เช่า</strong><br>
        ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่าห้องพักเลขที่ <strong>${contract.roomId}</strong> ชั้นที่ ${contract.roomId.charAt(1)} 
        อาคาร ${contract.roomId.charAt(0)}<br>
        ชื่อหอพัก หอพักนักศึกษา มหาวิทยาลัยราชภัฏศรีสะเกษ ตั้งอยู่ ณ เลขที่ 319 หมู่ที่ 8 ถนนไทยพันทา ตำบล/แขวง โพธิ์ 
        อำเภอ/เขต เมือง จังหวัด ศรีสะเกษ 33000
    </div>
    
    <div class="clause">
        <strong>ข้อ 2. วัตถุประสงค์ของการเช่า</strong><br>
        ผู้เช่าตกลงให้เช่าทรัพย์ตามข้อ 1. เพื่อวัตถุประสงค์ในการพักอาศัยเท่านั้น
    </div>
    
    <div class="clause">
        <strong>ข้อ 3. อัตราค่าเช่าและระยะเวลาการเช่า</strong><br>
        คู่สัญญาตกลงเช่าทรัพย์ตามข้อ 1. มีกำหนดเวลา 1 ปีการศึกษา นับตั้งแต่วันที่ ${startDate.getDate()} 
        เดือน ${getThaiMonth(startDate.getMonth())} พ.ศ. ${startDate.getFullYear() + 543}<br>
        ถึงวันที่ ${endDate.getDate()} เดือน ${getThaiMonth(endDate.getMonth())} พ.ศ. ${endDate.getFullYear() + 543} 
        โดยจะชำระค่าเช่าภาคเรียนละ <strong>${contract.rentalFee.toLocaleString()}</strong> บาท 
        (${numberToThaiText(contract.rentalFee)})<br>
        ซึ่ง 1 ปีการศึกษามี 2 ภาคเรียน ผู้เช่าจะต้องชำระเงินค่าเช่ารวมเป็นเงิน <strong>${(contract.rentalFee * 2).toLocaleString()}</strong> บาท 
        (${numberToThaiText(contract.rentalFee * 2)})
    </div>
    
    <div class="clause">
        <strong>ข้อ 4. เงินประกันการเช่า</strong><br>
        ในวันทำสัญญานี้ ผู้เช่าได้วางเงินประกันของเสียหายจำนวน 400 บาท (สี่ร้อยบาทถ้วน) และค่าประกันลูกกุญแจ 
        จำนวน 50 บาท (ห้าสิบบาทถ้วน) ให้แก่ผู้ให้เช่า
    </div>
    
    <div class="clause">
        <strong>ข้อ 5. ระเบียบหอพัก</strong><br>
        ผู้เช่าจะต้องปฏิบัติตามระเบียบหอพักที่ผู้ให้เช่าได้กำหนดไว้ เพื่อความเรียบร้อยและปลอดภัยของผู้เช่าทุกคน
    </div>
    
    <div class="clause">
        <strong>ข้อ 6. ค่าน้ำประปา ค่ากระแสไฟฟ้า</strong><br>
        (1) ค่าน้ำประปา คนละ 30 บาท/เดือน (สามสิบบาทถ้วน)<br>
        (2) ค่ากระแสไฟฟ้า หน่วยละ 5 บาท (ห้าบาทถ้วน)
    </div>

    <div class="signature-section">
        <div class="content">
            สัญญานี้ทำขึ้นเป็น 2 ฉบับ มีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความดีแล้ว 
            จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน
        </div>
        
        <div class="signature-row">
            <div>
                ลงชื่อ..............................................................ผู้ให้เช่า<br>
                (นางเพ็ญพักตร์ สุมณฑา)<br>
                หัวหน้างานพัฒนานักศึกษา
            </div>
            <div>
                ลงชื่อ............................................................ผู้เช่า<br>
                (${user.fullName})<br>
                นักศึกษา รหัส ${user.studentId}
            </div>
        </div>
        
        <div class="signature-row">
            <div>
                ลงชื่อ..................................................................พยาน<br>
                (นายเทิดศักดิ์ ทองเกิด)<br>
                เจ้าหน้าที่บริหารงานทั่วไป
            </div>
            <div>
                ลงชื่อ..........................................................พยาน<br>
                (...................................................................)<br>
                ผู้ปกครอง
            </div>
        </div>
    </div>
</body>
</html>`;
}

function getThaiMonth(month: number): string {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  return months[month];
}

function numberToThaiText(num: number): string {
  if (num === 3500) return 'สามพันห้าร้อยบาทถ้วน';
  if (num === 5000) return 'ห้าพันบาทถ้วน';
  if (num === 5500) return 'ห้าพันห้าร้อยบาทถ้วน';
  if (num === 7000) return 'เจ็ดพันบาทถ้วน';
  if (num === 10000) return 'หนึ่งหมื่นบาทถ้วน';
  if (num === 11000) return 'หนึ่งหมื่นหนึ่งพันบาทถ้วน';
  return `${num.toLocaleString()}บาทถ้วน`;
}