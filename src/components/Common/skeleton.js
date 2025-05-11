export const SkeletonWrapper = ({ loading, children, rows = 1, width = "w-full", height = "h-6" }) => {
    return loading ? (
      Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className={`animate-pulse bg-gray-300 rounded ${width} ${height} mb-2 last:mb-0`}
      />
      ))
    ) : (
      children
    );
  };
  