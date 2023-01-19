import { Handler, HandlerEvent, HandlerContext, schedule } from "@netlify/functions";

// Todo: Can encapsulate this better
const requestHeaders = new Headers()
requestHeaders.set('Authorization', `DSN ${process.env.SENTRY_DSN}`)
requestHeaders.set('Content-Type', "application/json")

const startSentryCheckIn = async () => {
  await fetch(`https://sentry.io/api/0/monitors/${process.env.SENTRY_CRON_MONITOR_FAILURE_ID}/checkins/`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({status: "in_progress"})
  })
}

const myHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  await startSentryCheckIn()
  console.log("Received event:", event);

  // By not adding a 'complete' heartbeat check to Sentry, this will be considered
  // a failed run of the cron job
  return {
      statusCode: 200,
  };
};

const handler = schedule("@hourly", myHandler)

export { handler };