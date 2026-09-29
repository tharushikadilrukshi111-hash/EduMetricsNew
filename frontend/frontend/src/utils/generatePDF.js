import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (user, gpaData, courses) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(14, 165, 233); // ocean-500
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EduMetrics Report", 14, 20);

  // Student info
  doc.setTextColor(12, 74, 110);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${user?.name || "N/A"}`, 14, 45);
  doc.text(`Email: ${user?.email || "N/A"}`, 14, 52);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 59);

  // Summary boxes
  doc.setDrawColor(14, 165, 233);
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(14, 68, 55, 22, 3, 3, "FD");
  doc.roundedRect(77, 68, 55, 22, 3, 3, "FD");
  doc.roundedRect(140, 68, 55, 22, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("CGPA", 20, 76);
  doc.text("Total Credits", 83, 76);
  doc.text("Semesters", 146, 76);

  doc.setFontSize(18);
  doc.setTextColor(3, 105, 161);
  doc.setFont("helvetica", "bold");
  doc.text(`${gpaData.cgpa}`, 20, 87);
  doc.text(`${gpaData.totalCredits}`, 83, 87);
  doc.text(`${gpaData.semesters.length}`, 146, 87);

  // GPA per semester table
  doc.setFontSize(13);
  doc.setTextColor(12, 74, 110);
  doc.text("Semester-wise GPA", 14, 108);

  autoTable(doc, {
    startY: 112,
    head: [["Semester", "GPA", "Credits"]],
    body: gpaData.semesters.map((s) => [s.semester, s.gpa, s.credits]),
    headStyles: { fillColor: [14, 165, 233] },
    alternateRowStyles: { fillColor: [240, 249, 255] },
  });

  // Courses table
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.text("Course Details", 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [["Code", "Course", "Grade", "Credits", "Semester"]],
    body: courses.map((c) => [
      c.code || "-",
      c.name,
      c.grade,
      c.credits,
      `${c.year} - ${c.semester}`,
    ]),
    headStyles: { fillColor: [2, 132, 199] },
    alternateRowStyles: { fillColor: [240, 249, 255] },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `EduMetrics © ${new Date().getFullYear()} - Page ${i} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  doc.save(`EduMetrics_Report_${user?.name || "Student"}.pdf`);
};