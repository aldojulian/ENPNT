const ExcelJS = require('exceljs');
const path = require('path');

async function createTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    worksheet.columns = [
        { header: 'Number', key: 'no', width: 10 },
        { header: 'Test Case Number', key: 'tc_no', width: 20 },
        { header: 'Test Case Description', key: 'desc', width: 40 },
        { header: 'Expectation', key: 'exp', width: 40 },
        { header: 'Actual', key: 'act', width: 40 },
        { header: 'Test Status', key: 'status', width: 15 },
    ];

    worksheet.addRow({
        no: 1,
        tc_no: 'TC_LOGIN_001',
        desc: 'Verify Login with Valid Credentials',
        exp: 'User should be logged in successfully',
        act: '',
        status: 'Not Run'
    });

    const filePath = path.resolve(__dirname, 'test_report.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`Spreadsheet created at ${filePath}`);
}

createTemplate();
