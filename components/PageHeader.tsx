import type React from "react"
interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="mt-2 text-lg text-muted-foreground">{description}</p>}
          </div>
          {children && <div>{children}</div>}
        </div>
      </div>
    </div>
  )
}
