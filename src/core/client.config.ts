import { release } from 'node:os'
import { platform } from 'node:process'

export const ERROR_MESSAGE = ({
    error,
    workflowName,
    workflowVersion,
    alfredVersion,
}: {
    error: Error
    workflowName: string
    workflowVersion: string
    alfredVersion: string
}) =>
    `
\`\`\`
${error.stack}
\`\`\`

---------- metadata ----------

${workflowName} - version: ${workflowVersion}
Alfred ${alfredVersion}
${platform} ${release()}

------------------------------
`.trim()
