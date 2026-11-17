import { db as appDb } from "~/db";
import {
  getInstructorAnalytics as computeInstructorAnalytics,
  type AnalyticsViewer,
  type Db,
  type InstructorAnalytics,
} from "./lib/instructor-analytics.server";

export type {
  AnalyticsViewer,
  CourseCountryRevenue,
  CourseFunnel,
  CourseProgressSummary,
  FunnelLesson,
  InstructorAnalytics,
  QuizPassRate,
  RefundExposure,
  RevenueSeries,
} from "./lib/instructor-analytics.server";

/** Every figure on the instructor analytics page, read from the app's database. */
export function getInstructorAnalytics(
  viewer: AnalyticsViewer,
  params: URLSearchParams,
  now: Date
): InstructorAnalytics {
  return createInstructorAnalytics(appDb)(viewer, params, now);
}

/** The same reader over a database the caller supplies, such as a test database. */
export function createInstructorAnalytics(db: Db) {
  return (
    viewer: AnalyticsViewer,
    params: URLSearchParams,
    now: Date
  ): InstructorAnalytics => computeInstructorAnalytics(db, viewer, params, now);
}
