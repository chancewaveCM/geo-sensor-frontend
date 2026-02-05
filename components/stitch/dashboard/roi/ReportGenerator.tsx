'use client'

import { useState } from 'react'
import { Calendar, Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

export type ReportType = 'monthly' | 'quarterly' | 'yearly'
export type OutputFormat = 'pdf' | 'csv' | 'json' | 'xlsx'

export interface ReportGeneratorProps {
  onGenerate: (reportType: ReportType, format: OutputFormat) => Promise<void>
}

export function ReportGenerator({ onGenerate }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('monthly')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onGenerate(reportType, outputFormat)

      clearInterval(interval)
      setProgress(100)

      // Reset after completion
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Report generation failed:', error)
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const formatLabels: Record<OutputFormat, string> = {
    pdf: 'PDF (Standard Portrait)',
    csv: 'CSV (Raw Data Export)',
    json: 'JSON (API Structure)',
    xlsx: 'Excel (Spreadsheet)',
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Generate Report</CardTitle>
        <CardDescription>
          Automated financial data exports and ROI summaries
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Configuration Panel */}
          <div className="p-6 lg:p-8 lg:border-r border-border space-y-8">
            {/* Report Frequency */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-foreground uppercase tracking-wider">
                Report Frequency
              </legend>

              <RadioGroup value={reportType} onValueChange={(value: string) => setReportType(value as ReportType)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label
                      htmlFor="monthly"
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    >
                      Monthly Settlement Report
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label
                      htmlFor="quarterly"
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    >
                      Quarterly Performance Audit
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label
                      htmlFor="yearly"
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    >
                      Year-End Tax Summary
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </fieldset>

            {/* Output Format */}
            <div className="space-y-2">
              <Label htmlFor="output-format" className="text-sm font-bold uppercase tracking-wider">
                Output Format
              </Label>

              <Select value={outputFormat} onValueChange={(value: string) => setOutputFormat(value as OutputFormat)}>
                <SelectTrigger id="output-format" className="bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">{formatLabels.pdf}</SelectItem>
                  <SelectItem value="csv">{formatLabels.csv}</SelectItem>
                  <SelectItem value="json">{formatLabels.json}</SelectItem>
                  <SelectItem value="xlsx">{formatLabels.xlsx}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Generating report...</span>
                  <span className="font-semibold text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                variant="outline"
                className="w-full sm:flex-1 border-2 border-primary text-primary hover:bg-primary/5"
                disabled={isGenerating}
              >
                Preview
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:flex-[2] bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Generate {outputFormat.toUpperCase()} Report</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="p-6 lg:p-8 bg-muted/50 flex items-center justify-center">
            <div className="bg-card shadow-xl w-full max-w-sm rounded-lg border aspect-[4/3] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-brand-navy/10 p-2 rounded">
                  <FileText className="h-6 w-6 text-brand-navy" aria-hidden="true" />
                </div>
                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                  ROI Preview V1.02
                </span>
              </div>

              <h4 className="text-brand-navy text-xl font-black mb-2">
                ROI Summary
              </h4>

              <p className="text-muted-foreground text-sm mb-6">
                Aggregate performance for Q1 2026 across all GEO sensors.
              </p>

              <div className="mt-auto bg-primary/10 border-l-4 border-primary p-4 rounded">
                <p className="text-primary text-xs font-bold uppercase mb-1">
                  Total Return
                </p>
                <p className="text-4xl font-black text-primary">
                  348% ROI
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
