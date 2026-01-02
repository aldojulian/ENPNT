import { Reporter, TestCase, TestResult, FullResult, FullConfig } from '@playwright/test/reporter';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

class ExcelReporter implements Reporter {
    private filePath = path.resolve(process.cwd(), 'test_report.xlsx');

    async onTestEnd(test: TestCase, result: TestResult) {
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

            // Find the row for this test case. 
            // We assume the "Test Case Number" is in column 2 or "Test Case Description" is in column 3.
            // For this specific requirement, let's map based on the test title which we will set to match the spreadsheet description or ID.

            worksheet.eachRow((row, rowNumber) => {
                // Assuming Column 3 is Description or Column 2 is Test Case Number.
                // Let's use the test title to match against the description in Column 3.
                const descriptionCell = row.getCell(3).value?.toString();

                if (descriptionCell && test.title.includes(descriptionCell)) {
                    // Update Status (Column 6)
                    const statusCell = row.getCell(6);
                    statusCell.value = result.status === 'passed' ? 'Passed' : 'Failed';

                    // Update Actual (Column 5) - Optional, can put error message or "Success"
                    const actualCell = row.getCell(5);
                    if (result.status === 'passed') {
                        actualCell.value = 'User successfully logged in';
                    } else {
                        actualCell.value = `Failed: ${result.error?.message || 'Unknown error'}`;
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

export default ExcelReporter;
