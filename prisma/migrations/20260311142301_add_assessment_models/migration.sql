-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "assessmentNumber" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallScore" DOUBLE PRECISION,
    "overallLevel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "teacherNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainScore" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "level" TEXT,
    "observations" TEXT,
    "questionGroupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionScore" (
    "id" SERIAL NOT NULL,
    "domainScoreId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionGroup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "questionGroupId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "helperText" TEXT,
    "scoreType" TEXT NOT NULL DEFAULT 'numeric',
    "minScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "step" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_assessmentNumber_key" ON "Assessment"("assessmentNumber");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainScore" ADD CONSTRAINT "DomainScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainScore" ADD CONSTRAINT "DomainScore_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "QuestionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionScore" ADD CONSTRAINT "QuestionScore_domainScoreId_fkey" FOREIGN KEY ("domainScoreId") REFERENCES "DomainScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "QuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
