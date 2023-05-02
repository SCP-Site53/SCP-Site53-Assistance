export function Ana(leave) {
    if (Date.now() > leave.end) {
        return leave.end;
    } else {
        return Date.now();
    };
}