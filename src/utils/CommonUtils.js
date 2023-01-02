import { formatValue } from 'react-currency-input-field';
import * as XLSX from 'xlsx';

class CommonUtils {
    static isNumber1(number) {
        if (number === 1) return true;
        return false;
    }

    static formattedValue = (money) => {
        return formatValue({
            value: money,
            groupSeparator: ',',
            decimalSeparator: '.',
            suffix: ' VNĐ',
        });
    };

    static formattedValueNoVND = (money) => {
        return formatValue({
            value: money,
            groupSeparator: '.',
            decimalSeparator: ',',
        });
    };

    static readExcel = (file) => {
        return new Promise((resolve, reject) => {
            try {
                // console.log('đang ở readExcel', file);
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: 'buffer' });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws);

                    resolve(data);
                };

                fileReader.onerror = (error) => {
                    reject(false);
                };
            } catch (error) {
                reject(false);
            }
        });
    };
}

export default CommonUtils;
