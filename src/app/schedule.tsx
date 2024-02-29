import { iacb } from "@/app/data";

export default function Schedule() {
    return (
        <>
            {iacb.weekDays.map((day) => {
                return (
                    <div className="overflow-x-auto">
                        {day.dow}
                        <div className="grid w-full grid-flow-row grid-cols-[repeat(16,1fr)]">
                            {[...Array(16)].map((x, i) => (
                                <div className="w-20" key={i}>
                                    Week {i + 1}
                                </div>
                            ))}
                            {day.rows.map((row, key) => 
                                row.weekCodes.map((code) => 
                                     <div
                                        style={{
                                            gridRow: key+2,
                                            gridColumn: code.slice(6),
                                        }}
                                        className="bg-red-400 grid"
                                    >
                                        {row.subjectName}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
