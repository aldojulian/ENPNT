const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelReporter {
    constructor() {
        this.filePath = path.resolve(process.cwd(), 'test_report.xlsx');
    }

    async onTestEnd(test, result) {
        try {
            const workbook = new ExcelJS.Workbook();

            if (fs.existsSync(this.filePath)) {
                await workbook.xlsx.readFile(this.filePath);
            } else {
                console.log('Spreadsheet not found. Please ensure test_report.xlsx exists.');
                return;
            }

            const worksheet = workbook.getWorksheet(1); // Assuming first sheet
            if (!worksheet) return;

            worksheet.eachRow((row, rowNumber) => {
                const descriptionCell = row.getCell(3).value?.toString();

                if (descriptionCell && test.title.includes(descriptionCell)) {
                    // Update Status (Column 6)
                    const statusCell = row.getCell(6);
                    statusCell.value = result.status === 'passed' ? 'Passed' : 'Failed';

                    // Update Actual (Column 5) - Optional, can put error message or "Success"
                    const actualCell = row.getCell(5);
                    const timestamp = new Date().toLocaleString();
                    if (result.status === 'passed') {
                        actualCell.value = `[${timestamp}] User successfully logged in`;
                    } else {
                        actualCell.value = `[${timestamp}] Failed: ${result.error?.message || 'Unknown error'}`;
                    }
                }
            });

            await workbook.xlsx.writeFile(this.filePath);
            console.log(`Updated Excel report for test: ${test.title}`);
        } catch (error) {
            console.error('Error updating Excel report:', error);
        }
    }
}

module.exports = ExcelReporter;
