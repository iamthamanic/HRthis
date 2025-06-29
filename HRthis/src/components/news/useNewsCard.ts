import { DashboardInfo } from '../../types/dashboardInfo';

export const useNewsCard = (item: DashboardInfo) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.file.data;
    link.download = item.file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdf = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${item.file.filename}</title>
            <style>
              body { margin: 0; padding: 0; background: #f5f5f5; }
              iframe { width: 100vw; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${item.file.data}" type="application/pdf"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return {
    handleDownload,
    handleOpenPdf,
    formatDate
  };
};