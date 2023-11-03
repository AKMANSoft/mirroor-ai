import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { PaginatedAudioBlocks } from "@/types/api";
import { useEffect, useRef, useState } from "react";

export default function AudiosGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { trans } = handleTranslation()
    const [userData, setUserData] = useState<PaginatedAudioBlocks | null>();
    const loadData = async () => {
        setUserData(null)
        const res = await api.getUserData({ page: 1, perPage: 100, recentsOnly: true });
        setUserData(res)
    }

    useEffect(() => {
        loadData()
    }, [])

    const userDataList = userData?.data ?? [];
    // userDataList = [...userDataList, ...userDataList, ...userDataList, ...userDataList, ...userDataList, ...userDataList]
    let datesList: Date[] = []
    userDataList.forEach(({ createdAt: date }) => {
        if (datesList.some((dd) => dd.getFullYear() === date.getFullYear() && dd.getMonth() === date.getMonth() && dd.getDate() === date.getDate())) {
            return;
        }
        datesList.push(date)
    })
    datesList = datesList.sort((a, b) => a.getTime() - b.getTime())
    const height = 500

    return (
        <div className="bg-secondary py-20">
            <h2 className="text-4xl font-bold text-primary text-center">
                {trans("weekly_graph_heading")}
            </h2>
            <div className="max-w-screen-xl mx-auto flex justify-center px-4 md:px-5 mt-10">
                {
                    <div className="w-full relative overflow-x-auto no-scrollbar px-5" style={{ height }} ref={containerRef}>
                        {
                            containerRef.current &&
                            <div
                                className="w-full min-w-[600px] h-[2px] absolute top-1/2 -translate-y-1/2 left-0 bg-black"
                                style={{
                                    width: containerRef.current.scrollWidth
                                }}
                            />
                        }
                        <div className="flex gap-1 h-full">
                            {
                                datesList.map((date) => (
                                    <div className="relative flex items-center gap-1" >
                                        <span className="text-xs w-auto bg-primary rounded-sm text-white px-2 z-10">
                                            {date.getDate().toString().padStart(2, "0")}/{(date.getMonth() + 1).toString().padStart(2, "0")}
                                        </span>
                                        {
                                            userDataList
                                                ?.filter(({ createdAt: dd }) => dd.getFullYear() === date.getFullYear() && dd.getMonth() === date.getMonth() && dd.getDate() === date.getDate())
                                                ?.map(({ markino: score }, index) => (
                                                    score >= 0 ?
                                                        <div key={index} className="flex w-5 h-full">
                                                            <span className="bg-primary rounded-t-full w-full mt-auto relative" style={{ marginBottom: (height / 2) + 1, height: 200 * (Math.abs(score) / 100) }}>
                                                                <span className="text-xs text-primary absolute bottom-full left-1/2 -translate-x-1/2">
                                                                    {score}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        :
                                                        <div key={index} className="flex w-5 h-full">
                                                            <span className="bg-accent rounded-b-full w-full mb-auto relative" style={{ marginTop: (height / 2) + 1, height: 200 * (Math.abs(score) / 100) }}>
                                                                <span className="text-xs text-primary absolute top-full left-1/2 -translate-x-1/2">
                                                                    {score}
                                                                </span>
                                                            </span>
                                                        </div>
                                                ))
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}