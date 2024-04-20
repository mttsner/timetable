export type item = {
    color: number[];
    pos: number;
    row: any;
    id: number;
};

export type group = {
    // group time bounds
    startTime: string;
    endTime: string;

    week: number;
    cols: number;
    items: item[];
    // debug info:
    id: number;
    method: string;
};

const randomColor = (() => {
    const randomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return () => {
        var h = randomInt(0, 360);
        var s = randomInt(42, 98);
        var l = randomInt(40, 90);
        return [h, s, l];
    };
})();

const mergeGroups = (group1: group, group2: group) => {
    group2.items.forEach((item) => addItemToGroup(item, group1));
    // Check if row's startTime is before group's startTime
    if (group2.startTime < group1.startTime) {
        group1.startTime = group2.startTime;
    }
    // Check if group2's endTime is after group1's endTime
    if (group2.endTime > group1.endTime) {
        group1.endTime = group2.endTime;
    }
};

const addItemToGroup = (item: item, group: group) => {
    // Update the group's items list
    group.items.push(item);
    // Check for fast path where group contains only one item
    // since the to-be-added item must conflict with it
    if (group.items.length === 1) {
        group.cols++;
        item.pos = 1;
    } else {
        let taken = new Set();
        // Create set of all positions that the item overlaps
        group.items.forEach((itm) => {
            if (
                itm.row.endTime > item.row.startTime &&
                itm.row.startTime < item.row.endTime
            ) {
                taken.add(itm.pos);
            }
        });
        // Set item's pos to possible new column
        item.pos = group.cols;
        // Find first empty place in set
        for (let i = 0; i < group.cols; i++) {
            if (!taken.has(i)) {
                item.pos = i;
                break;
            }
        }
        // If no empty space was found we must increase the amount columns
        if (item.pos == group.cols) {
            group.cols++;
        }
    }
};

export const generateLayout = (rows: any) => {
    let weeks: {
        [code: string]: group[];
    } = {};
    // Unique id's for all cards/items in layout
    let itemId = 0;
    // debug state
    let groupId = 0;
    // Loop over subjects
    rows.forEach((row: any) => {
        // Generate random color for item
        let color = randomColor();
        // Loop over the weeks the subject takes place
        row.weekCodes.forEach((weekCode: string) => {
            itemId++;
            // Create empty array for week code if not present
            if (weeks[weekCode] === undefined) {
                weeks[weekCode] = [];
            }
            // Create new item for this subject
            let item = {
                pos: 0,
                row: row,
                color: color,
                id: itemId,
            };
            // Filter out all conflicts where subjects overlap
            let conflicts = weeks[weekCode].filter(
                (group) =>
                    group.endTime > row.startTime &&
                    group.startTime < row.endTime
            );
            // If there are no conflicts create a new group
            if (conflicts.length == 0) {
                groupId++;
                weeks[weekCode].push({
                    startTime: row.startTime,
                    endTime: row.endTime,
                    week: Number(weekCode.slice(6)),
                    items: [item],
                    cols: 1,
                    // Debug stuff
                    id: groupId,
                    method: "No conflicts",
                });
                return;
            }
            // If there is only one conflict then add the item to that group
            if (conflicts.length == 1) {
                addItemToGroup(item, conflicts[0]);
                // Check if row's startTime is before group's startTime
                if (item.row.startTime < conflicts[0].startTime) {
                    conflicts[0].startTime = item.row.startTime;
                }
                // Check if group2's endTime is after group1's endTime
                if (item.row.endTime > conflicts[0].endTime) {
                    conflicts[0].endTime = item.row.endTime;
                }
                return;
            }
            // New group for the item
            groupId++;
            let mergedGroup = {
                startTime: row.startTime,
                endTime: row.endTime,
                week: Number(weekCode.slice(6)),
                items: [item],
                cols: 1,
                // debug stuff
                id: groupId,
                method: "Merge",
            };
            // If there are more than one conflict, we must merge the groups
            conflicts.forEach((group) => {
                mergeGroups(mergedGroup, group);
            });
            // Remove conflict groups that were merged
            weeks[weekCode] = weeks[weekCode].filter(
                (item) => !conflicts.includes(item)
            );
            // Add the new group that everything was merged into
            weeks[weekCode].push(mergedGroup);
        });
    });

    return Object.values(weeks);
};
