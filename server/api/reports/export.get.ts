import { defineEventHandler, getQuery, createError, setHeader } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const assessmentId = parseInt(query.assessmentId as string)

  if (!assessmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Assessment ID is required' })
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      student: true,
      domainScores: {
        include: {
          questionGroup: true,
          questionScores: true
        }
      }
    }
  })

  if (!assessment) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  doc.setFillColor(139, 92, 246)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Assessment Report', 14, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Student: ${assessment.student?.firstname} ${assessment.student?.lastname}`, 14, 30)
  doc.text(`Assessment #: ${assessment.assessmentNumber}`, pageWidth - 14, 20, { align: 'right' })
  doc.text(`Date: ${new Date(assessment.assessmentDate).toLocaleDateString()}`, pageWidth - 14, 30, { align: 'right' })
  
  let yPos = 50
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Assessment Information', 14, yPos)
  
  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const getLevelColor = (level: string): [number, number, number] => {
    switch (level) {
      case 'Advanced': return [139, 92, 246]
      case 'Proficient': return [16, 185, 129]
      case 'Developing': return [245, 158, 11]
      case 'Emerging': return [239, 68, 68]
      default: return [107, 114, 128]
    }
  }

  const infoData = [
    ['Assessment #', assessment.assessmentNumber],
    ['Student', `${assessment.student?.firstname} ${assessment.student?.lastname}`],
    ['Age', `${assessment.student?.age || '-'} years`],
    ['Assessment Date', new Date(assessment.assessmentDate).toLocaleDateString()],
    ['Overall Score', assessment.overallScore?.toFixed(2) || '-'],
    ['Overall Level', assessment.overallLevel || '-']
  ]
  
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: infoData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
    margin: { left: 14 }
  })
  
  yPos = (doc as any).lastAutoTable.finalY + 10
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Current Assessment Scores', 14, yPos)
  
  yPos += 5
  
  const questionScoresList: any[] = []
  let index = 1
  assessment.domainScores.forEach((ds: any) => {
    if (ds.questionScores) {
      ds.questionScores.forEach((qs: any) => {
        questionScoresList.push({
          index: index++,
          domain: ds.domain,
          questionText: qs.questionText,
          score: qs.score,
          level: ds.level,
          comment: qs.comment || '-'
        })
      })
    }
  })
  
  const tableData = questionScoresList.map((q: any) => [
    q.index,
    q.domain,
    q.questionText,
    q.score.toString(),
    q.level,
    q.comment
  ])
  
  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Domain', 'Question', 'Score', 'Level', 'Comments']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [139, 92, 246],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 15 },
      4: { cellWidth: 25 },
      5: { cellWidth: 40 }
    },
    didParseCell: (hookData: any) => {
      if (hookData.column.index === 4 && hookData.section === 'body') {
        const level = hookData.cell.raw
        const rgb = getLevelColor(level)
        hookData.cell.styles.textColor = rgb
        hookData.cell.styles.fontStyle = 'bold'
      }
    }
  })
  
  yPos = (doc as any).lastAutoTable.finalY + 15
  
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Child Development Profile', 14, yPos)
  
  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Overall Score: ${assessment.overallScore?.toFixed(2) || '-'}`, 14, yPos)
  yPos += 5
  doc.text(`Overall Level: ${assessment.overallLevel || '-'}`, 14, yPos)
  
  const levelColor = getLevelColor(assessment.overallLevel || '')
  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2], 30)
  doc.roundedRect(14, yPos + 2, 40, 10, 2, 2, 'F')
  doc.setTextColor(levelColor[0], levelColor[1], levelColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(assessment.overallLevel || '-', 34, yPos + 9, { align: 'center' })
  
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, 285, { align: 'center' })
  doc.text('KidsFirst Development Assessment System', pageWidth / 2, 290, { align: 'center' })
  
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="Assessment_Report_${assessment.assessmentNumber}.pdf"`)
  
  return doc.output('arraybuffer')
})
