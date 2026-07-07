import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ItineraryDay } from "@/lib/activities";

interface ExcursionTimelineProps {
  itinerary: ItineraryDay[];
}

function TimelineDay({ steps }: { steps: ItineraryDay["steps"] }) {
  return (
    <ol className="relative pl-8 space-y-0">
      {/* Vertical dashed line */}
      <div className="absolute left-3.5 top-4 bottom-4 w-px border-l-2 border-dashed border-primary/30" />

      {steps.map((step, i) => (
        <li key={i} className="relative pb-8 last:pb-0">
          {/* Step circle */}
          <div className="absolute -left-[1px] flex items-center justify-center">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-soft ring-4 ring-background">
              {i + 1}
            </div>
          </div>

          <div className="ml-6 group">
            <div className="flex flex-wrap items-baseline gap-3 mb-1">
              <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/25 px-3 py-0.5 text-xs font-bold text-accent-foreground tracking-wide font-display">
                {step.time}
              </span>
              <h4 className="font-display text-base font-semibold">{step.label}</h4>
            </div>
            {step.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ExcursionTimeline({ itinerary }: ExcursionTimelineProps) {
  const isMultiDay = itinerary.length > 1;

  if (!isMultiDay) {
    return (
      <div className="bg-primary-soft/40 rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
          <span className="inline-block h-1 w-6 rounded-full bg-primary" />
          Itinerary
        </h3>
        <TimelineDay steps={itinerary[0].steps} />
      </div>
    );
  }

  return (
    <div className="bg-primary-soft/40 rounded-2xl p-6">
      <h3 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
        <span className="inline-block h-1 w-6 rounded-full bg-primary" />
        Itinerary
      </h3>
      <Tabs defaultValue="day-1">
        <TabsList className="mb-6 rounded-full bg-background border border-border p-1 w-full sm:w-auto">
          {itinerary.map((day) => (
            <TabsTrigger
              key={day.day}
              value={`day-${day.day}`}
              className="rounded-full flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-semibold"
            >
              Day {day.day}
            </TabsTrigger>
          ))}
        </TabsList>

        {itinerary.map((day) => (
          <TabsContent key={day.day} value={`day-${day.day}`}>
            <p className="text-sm font-semibold text-primary mb-4">{day.title}</p>
            <TimelineDay steps={day.steps} />
            {day.day === 1 && itinerary.length > 1 && (
              <div className="mt-6 rounded-xl bg-accent/10 border border-accent/20 p-4 flex items-center gap-3">
                <span className="text-2xl">🌙</span>
                <p className="text-sm text-accent-foreground font-medium">
                  Tonight: overnight stay in a traditional Berber desert camp under the Milky Way.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
