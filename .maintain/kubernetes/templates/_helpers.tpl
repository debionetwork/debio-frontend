{{/*
Expand the name of the chart.
*/}}
{{- define "debio-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "debio-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "debio-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "debio-frontend.labels" -}}
helm.sh/chart: {{ include "debio-frontend.chart" . }}
{{ include "debio-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "debio-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "debio-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "debio-frontend.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "debio-frontend.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of recaptchaSiteKey secret.
*/}}
{{- define "debio-frontend.recaptchaSiteKeySecretName" -}}
{{- printf "%s-%s" (include "debio-frontend.fullname" .) "recaptcha-site-key" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of debioEscrowETHAddress secret.
*/}}
{{- define "debio-frontend.debioEscrowETHAddressSecretName" -}}
{{- printf "%s-%s" (include "debio-frontend.fullname" .) "debio-escrow-eth-address" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of devDebioEscrowETHAddress secret.
*/}}
{{- define "debio-frontend.devDebioEscrowETHAddressSecretName" -}}
{{- printf "%s-%s" (include "debio-frontend.fullname" .) "dev-debio-escrow-eth-address" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of daiContractAddress secret.
*/}}
{{- define "debio-frontend.daiContractAddressSecretName" -}}
{{- printf "%s-%s" (include "debio-frontend.fullname" .) "dai-contract-address" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of debioApiKey secret.
*/}}
{{- define "debio-frontend.debioApiKeySecretName" -}}
{{- printf "%s-%s" (include "debio-frontend.fullname" .) "debio-api-key" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
