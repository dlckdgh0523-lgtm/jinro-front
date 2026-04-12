import React, { useState } from "react";
import { Breadcrumb, PageTitle } from "../../components/AppShell";
import { ADMISSIONS_DATA } from "../../data/mock";
import { Search, Filter, ChevronDown } from "lucide-react";

const YEARS = ["전체", "2025", "2024", "2023"];
const TYPES = ["전체", "수시", "정시"];
const CATEGORIES = ["전체", "학생부교과", "학생부종합", "논술", "수능위주", "실기/특기"];
const REGIONS = ["전체", "서울", "경기", "부산", "대구", "인천"];
const SORT_OPTIONS = ["최신순", "등급 높은순", "등급 낮은순", "대학명순"];

export function AdmissionsData() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("전체");
  const [adType, setAdType] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState("최신순");

  const filtered = ADMISSIONS_DATA.filter((d) => {
    if (search && !d.university.includes(search) && !d.department.includes(search)) return false;
    if (adType !== "전체" && d.type !== adType) return false;
    if (category !== "전체" && d.category !== category) return false;
    if (year !== "전체" && String(d.year) !== year) return false;
    return true;
  });

  const SelectFilter = ({ label, value, options, onChange }: any) => (
    <div className="relative">
      <select
        className="h-9 pl-3 pr-8 rounded-xl border border-border bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o: string) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "진로 / 입시" }, { label: "최근 입시 데이터" }]} />
      <PageTitle
        title="최근 입시 데이터"
        subtitle="수시·정시 최신 등급컷과 합격 결과 데이터를 확인하세요."
      />

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              placeholder="대학명, 학과명으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SelectFilter label="학년도" value={year} options={YEARS} onChange={setYear} />
          <SelectFilter label="수시/정시" value={adType} options={TYPES} onChange={setAdType} />
          <SelectFilter label="전형 유형" value={category} options={CATEGORIES} onChange={setCategory} />
          <SelectFilter label="지역" value={region} options={REGIONS} onChange={setRegion} />
          <SelectFilter label="정렬" value={sort} options={SORT_OPTIONS} onChange={setSort} />
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-4">
        {TYPES.slice(1).map((t) => (
          <button
            key={t}
            onClick={() => setAdType(adType === t ? "전체" : t)}
            className={`px-4 h-8 rounded-xl text-sm border transition-colors ${
              adType === t
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">총 {filtered.length}건</span>
      </div>

      {/* Table */}
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
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground">{d.university}</p>
                    <p className="text-xs text-muted-foreground">{d.year}학년도</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-foreground">{d.department}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      d.type === "수시"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full border border-border">
                      {d.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-semibold text-primary">{d.cutGrade}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm text-foreground">{d.seats}명</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      d.source === "대학어디가"
                        ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700"
                        : "border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                    }`}>
                      {d.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-muted-foreground">{d.updated}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    검색 결과가 없습니다. 필터를 변경해보세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
