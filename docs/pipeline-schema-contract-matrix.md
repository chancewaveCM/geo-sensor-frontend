# Pipeline Schema Contract Matrix (Frontend <-> Backend)

Date: 2026-02-09
Scope: Phase 4-5 blockers reported in architecture review (`1 WARN`)

## Summary

This matrix tracks all known schema mismatches between frontend types/API client and backend response contracts for the pipeline modules. These items do not currently break build, but can cause runtime/UI issues in Phase 4-5.

Current status on this branch: all 5 mismatches are resolved in code (`S0-2` to `S0-6`), with guard tests added (`S0-7`).

## Mismatch Matrix

| # | Contract | Frontend (Before) | Backend (Before) | Impact | Resolution Status |
|---|---|---|---|---|---|
| 1 | `CompanyProfilePipelineStats` field names | `query_set_count`, `success_rate`, `total_responses` in `types/pipeline.ts` | `total_query_sets`, `success_rate_30d`, `last_run_status`, `avg_processing_time_seconds`, `data_freshness_hours`, `health_grade` in `app/api/v1/endpoints/pipeline.py` | Runtime field mismatch in T9/T14 | Resolved: frontend interface aligned to backend fields |
| 2 | `QuerySetDetail.last_job` type shape | `PipelineJobSummary` in `types/pipeline.ts` (`progress_percentage`, `created_at`) | `QuerySetDetailJobItem` in backend includes `llm_providers`, `total_queries`, `completed_queries`, `failed_queries`, `started_at`, `completed_at` | Missing fields / unsafe access in T11 | Resolved: frontend `last_job` uses detail job schema |
| 3 | `QuerySetDetail.total_jobs` presence | Missing in frontend `QuerySetDetail` type | Present in backend `QuerySetDetailResponse.total_jobs` | Data not shown in T11 | Resolved: `total_jobs` added in frontend type |
| 4 | `ScheduleConfig` company fields | Frontend expects `company_profile_id`, `company_name` | Backend `ScheduleConfigResponse` currently does not include company fields | Cannot render company column in T15 | Resolved: backend response now includes company fields |
| 5 | `list_schedules` filtering params | Frontend client supports only `query_set_id` | Backend `list_schedules` supports no query filters | Company filter not working in T15 | Resolved: backend adds `query_set_id/company_profile_id`; frontend client supports both |

## Source References

- Frontend types: `geo-sensor-frontend/types/pipeline.ts`
- Frontend API client: `geo-sensor-frontend/lib/api/pipeline.ts`
- Backend contracts/endpoints: `geo-sensor-backend/app/api/v1/endpoints/pipeline.py`

## Execution Order

1. `S0-2`: Company stats field synchronization.
2. `S0-3`: `QuerySetDetail.last_job` type synchronization.
3. `S0-4`: `QuerySetDetail.total_jobs` synchronization.
4. `S0-5`: Add company fields to schedule response.
5. `S0-6`: Add schedule filters (`company_profile_id`, `query_set_id`) and frontend wiring.
6. `S0-7`: Add guard tests for contract drift.

## Guard Tests

- Backend: `geo-sensor-backend/tests/unit/test_pipeline_contract_models.py`
  - Verifies `CompanyProfilePipelineStats` contract fields.
  - Verifies `QuerySetDetailResponse` requires and exposes `total_jobs`.
  - Verifies `ScheduleConfigResponse` requires company fields.
  - Verifies `/api/v1/pipeline/schedules` exposes `query_set_id` and `company_profile_id` query params.
