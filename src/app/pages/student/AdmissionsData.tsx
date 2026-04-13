import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { Search, ChevronDown, Info } from "lucide-react";
import { appGet } from "../../utils/appApi";

type AdmissionItem = {
  id: string;
  university: string;
  department: string;
  year: number;
  type: "수시" | "정시";
  category: "학생부교과" | "학생부종합" | "논술" | "수능위주" | "특기/실적";
  cutGrade: string | null;
  seats: number | null;
  source: string;
  updated: string;
};

const YEARS = ["전체", "2026", "2025", "2024", "2023"];
const TYPES = ["전체", "수시", "정시"] as const;
const CATEGORIES = ["전체", "학생부교과", "학생부종합", "논술", "수능위주", "특기/실적"] as const;
const REGIONS = ["전체", "서울", "경기", "부산", "대구", "인천"];
const SORT_OPTIONS = ["최신순", "등급컷 낮은순", "등급컷 높은순", "대학명순"] as const;

const parseCutGrade = (value: string | null) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

export function AdmissionsData() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("전체");
  const [adType, setAdType] = useState<(typeof TYPES)[number]>("전체");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>("최신순");
  const [items, setItems] = useState<AdmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAdmissions = async () => {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: "1",
        pageSize: "100"
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (year !== "전체") {
        params.set("year", year);
      }

      if (adType !== "전체") {
        params.set("type", adType);
      }

      if (category !== "전체") {
        params.set("category", category);
      }

      if (region !== "전체") {
        params.set("region", region);
      }

      try {
        const response = await appGet<AdmissionItem[]>(`/v1/admissions?${params.toString()}`);

        if (active) {
          setItems(response);
        }
      } catch (requestError) {
        if (active) {
          setItems([]);
          setError(requestError instanceof Error ? requestError.message : "입시 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchAdmissions();

    return () => {
      active = false;
    };
  }, [adType, category, region, search, year]);

  const filtered = useMemo(() => {
    const sortedItems = [...items];

    sortedItems.sort((left, right) => {
      if (sort === "대학명순") {
        return left.university.localeCompare(right.university, "ko");
      }

      if (sort === "등급컷 낮은순") {
        return parseCutGrade(left.cutGrade) - parseCutGrade(right.cutGrade);
      }

      if (sort === "등급컷 높은순") {
        return parseCutGrade(right.cutGrade) - parseCutGrade(left.cutGrade);
      }

      return right.updated.localeCompare(left.updated);
    });

    return sortedItems;
  }, [items, sort]);

  const SelectFilter = ({
    value,
    options,
    onChange
  }: {
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
  }) => (
    <div className="relative">
      <select
        className="h-9 pl-3 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "최신 입시 데이터" }]} />
      <PageTitle
        title="최신 입시 데이터"
        subtitle="수시·정시 최신 등급컷과 합격 결과 데이터를 확인하세요."
      />

      {/* Limited data notice */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5">
        <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          현재 입시 데이터는 <strong>초기 운영 데이터</strong>로 수록 건수가 제한적입니다. 실제 입시 정보는 <strong>대입정보포털 어디가(adiga.go.kr)</strong> 또는 각 대학 입학처에서 직접 확인하세요.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              placeholder="대학명, 학과명으로 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <SelectFilter value={year} options={YEARS} onChange={setYear} />
          <SelectFilter value={adType} options={TYPES} onChange={(value) => setAdType(value as (typeof TYPES)[number])} />
          <SelectFilter
            value={category}
            options={CATEGORIES}
            onChange={(value) => setCategory(value as (typeof CATEGORIES)[number])}
          />
          <SelectFilter value={region} options={REGIONS} onChange={setRegion} />
          <SelectFilter value={sort} options={SORT_OPTIONS} onChange={(value) => setSort(value as (typeof SORT_OPTIONS)[number])} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {TYPES.slice(1).map((type) => (
          <button
            key={type}
            onClick={() => setAdType(adType === type ? "전체" : type)}
            className={`px-4 h-8 rounded-xl text-sm border transition-colors ${
              adType === type
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {type}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">총 {filtered.length}건</span>
      </div>

      {error && <p className="text-xs text-destructive mb-4">{error}</p>}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">대학명</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">학과명</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">구분</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">전형 유형</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">등급컷</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">모집인원</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">출처</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">업데이트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    입시 데이터를 불러오고 있습니다.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    검색 결과가 없습니다. 필터를 변경해보세요.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground">{item.university}</p>
                      <p className="text-xs text-muted-foreground">{item.year}학년도</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-foreground">{item.department}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.type === "수시"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full border border-border">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm font-semibold text-primary">{item.cutGrade ?? "-"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm text-foreground">{item.seats ?? "-"}명</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs px-2 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs text-muted-foreground">{item.updated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
