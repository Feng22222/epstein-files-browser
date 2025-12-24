export function CelebrityDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
      <p>
        检测由以下技术提供支持：{
}        <a
          href="https://aws.amazon.com/rekognition/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/80 hover:text-primary underline-offset-2 hover:underline transition-colors"
        >
          AWS Rekognition
        </a>
        。结果可能不准确。{
}        <a
          href="https://github.com/RhysSullivan/epstein-files-browser"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/80 hover:text-primary underline-offset-2 hover:underline transition-colors"
        >
          查看源代码
        </a>
        。
      </p>
    </div>
  );
}
