

export const downloadCsv = (response: any, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([response]));

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);

    // Simulate a click event to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary URL and remove the link element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
}