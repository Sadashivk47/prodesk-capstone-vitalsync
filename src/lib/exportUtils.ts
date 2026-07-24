import { MedicalRecord } from '../types';

export function exportToCSV(records: MedicalRecord[], patientName: string) {
  const headers = ['Date', 'Encounter Type', 'Attending Physician', 'Diagnosis', 'Symptoms', 'Clinical Notes', 'Prescriptions'];
  
  const rows = records.map((record) => {
    const rxString = record.prescriptions.map((p) => `${p.name} (${p.dosage})`).join('; ');
    return [
      `"${record.date}"`,
      `"${record.encounterType}"`,
      `"${record.attendingPhysician}"`,
      `"${record.diagnosis}"`,
      `"${record.symptoms.replace(/"/g, '""')}"`,
      `"${record.clinicalNotes.replace(/"/g, '""')}"`,
      `"${rxString}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedName = patientName.replace(/\s+/g, '_');
  link.setAttribute('download', `${sanitizedName}_Medical_History_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(records: MedicalRecord[], patientName: string, patientInfo: { age: number; idCode: string }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Medical History Report - ${patientName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #0d1c2e; background: #ffffff; }
          .header { border-bottom: 2px solid #005c55; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: bold; color: #005c55; }
          .subtitle { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6e7977; }
          .patient-box { background: #f8f9ff; border: 1px solid #bdc9c6; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
          .patient-name { font-size: 22px; font-weight: bold; margin: 0 0 8px 0; color: #0d1c2e; }
          .record-card { border: 1px solid #bdc9c6; border-radius: 8px; margin-bottom: 20px; overflow: hidden; page-break-inside: avoid; }
          .record-header { background: #eff4ff; padding: 12px 20px; font-weight: bold; font-size: 13px; color: #005c55; display: flex; justify-content: space-between; }
          .record-body { padding: 20px; }
          .field-label { font-size: 11px; text-transform: uppercase; color: #6e7977; font-weight: bold; margin-bottom: 4px; }
          .field-value { font-size: 14px; margin-bottom: 16px; color: #3e4947; }
          .rx-box { background: #f8f9ff; border: 1px solid #e6eeff; border-radius: 6px; padding: 12px; margin-top: 10px; }
          .footer { margin-top: 40px; border-top: 1px solid #bdc9c6; pt: 16px; font-size: 11px; color: #6e7977; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">VitalSync</div>
            <div class="subtitle">Clinical Intelligence Platform - Medical History Summary</div>
          </div>
          <div>Generated: ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="patient-box">
          <div class="patient-name">${patientName}</div>
          <div>Age: ${patientInfo.age} | Patient ID: ${patientInfo.idCode} | Status: ACTIVE FILE</div>
        </div>

        <h3>Chronological Medical History</h3>

        ${records
          .map(
            (rec) => `
          <div class="record-card">
            <div class="record-header">
              <span>${rec.date} - ${rec.encounterType}</span>
              <span>Attending: ${rec.attendingPhysician}</span>
            </div>
            <div class="record-body">
              <div class="field-label">Diagnosis</div>
              <div class="field-value" style="font-weight: bold; color: #005c55; font-size: 16px;">${rec.diagnosis}</div>

              <div class="field-label">Symptoms</div>
              <div class="field-value">${rec.symptoms}</div>

              <div class="field-label">Clinical Notes</div>
              <div class="field-value">${rec.clinicalNotes}</div>

              ${
                rec.prescriptions && rec.prescriptions.length > 0
                  ? `
                <div class="rx-box">
                  <div class="field-label">Prescriptions</div>
                  ${rec.prescriptions
                    .map(
                      (p) =>
                        `<div><strong>${p.name}</strong> - ${p.dosage} ${p.duration ? `(Duration: ${p.duration})` : ''}</div>`
                    )
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}

        <div class="footer">
          VitalSync Clinical Intelligence Platform - Confidential Healthcare Record - ISO 27001 Certified
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    // Fallback to Blob HTML download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patientName.replace(/\s+/g, '_')}_Medical_Report.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
