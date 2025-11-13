"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@labelz/ui/components/card";
import { useI18n } from "@/components/i18n-provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">{t("annotation_platform")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t("annotation_platform_des")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {/* Image Annotation */}
          <Link href="/annotate/image">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-6 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-blue-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">
                  {t("image_annotation")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("image_annotation_des")}
                </CardDescription>
              </CardHeader>
              {/* <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>• Draw rectangles, circles, and polygons</li>
                  <li>• AI-powered object detection</li>
                  <li>• Custom labels and categories</li>
                  <li>• Export annotations in multiple formats</li>
                </ul>
                <Button className="w-full" size="lg">
                  Start Image Annotation
                </Button>
              </CardContent> */}
            </Card>
          </Link>

          {/* Video Annotation */}
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {" "}
                {t("audio_annotation")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("to_be_continued")}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Audio Annotation */}
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {t("video_annotation")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("to_be_continued")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
