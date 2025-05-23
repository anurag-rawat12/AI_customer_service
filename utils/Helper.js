// Assign a color to each email based on its id (or username) so it stays consistent
export const getColorForEmail = (emailUser , emailID) => {
    // Use a hash of the username or id to pick a color deterministically
    const colors = ['bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-yellow-400', 'bg-purple-400'];
    let hash = 0;
    const str = emailUser || emailID.toString();
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};