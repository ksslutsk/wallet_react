export const pennyToGrn = (penny: number | undefined) => {
    if (penny !== undefined) return penny / 100;
}

export const grnToPenny = (grn: number | undefined) => {
    if (grn !== undefined) return grn * 100;
} 