const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

function openModal(filePath) {
    // 显示弹窗并给出加载提示
    modal.style.display = 'flex';
    modalBody.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2rem;">加载中...</p>';

    // 提取文件后缀，去掉可能的 URL 参数 (例如 #toolbar=0)
    const rawPath = filePath.split('#')[0]; 
    const extension = rawPath.split('.').pop().toLowerCase();

    // 1. 图片预览处理
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
        // pointer-events: none 和 oncontextmenu 防止右键和拖拽保存
        modalBody.innerHTML = `<img src="${filePath}" style="max-width: 100%; max-height: 80vh; object-fit: contain; pointer-events: none;" oncontextmenu="return false" ondragstart="return false">`;
    } 
    // 2. PDF 预览处理
    else if (extension === 'pdf') {
        // 这里的 filePath 已经包含了 HTML 中传进来的 #toolbar=0
        modalBody.innerHTML = `<iframe src="${filePath}" width="100%" height="80vh" style="border: none; background: white;"></iframe>`;
    } 
    // 3. Office 文件处理 (Excel, PPT)
    else if (['xlsx', 'pptx', 'docx'].includes(extension)) {
        // 判断是否为本地文件协议 (file://)
        if (window.location.protocol === 'file:') {
            modalBody.innerHTML = `
                <div style="background: white; padding: 40px; border-radius: 8px; text-align: center; max-width: 500px; margin: 0 auto;">
                    <h3 style="color: #e74c3c; margin-bottom: 10px;">⚠️ 本地预览受限</h3>
                    <p style="color: #555; line-height: 1.6;">Excel 和 PPT 文件需要借助微软在线服务进行解析展示。</p>
                    <p style="color: #555; line-height: 1.6;">由于您目前在本地电脑打开网页，外网服务器无法抓取到您的文件。<br><br><b>当您将项目推送到 GitHub Pages 后，即可正常在线预览。</b></p>
                </div>`;
        } else {
            // 部署到公网后的逻辑：拼接绝对路径并使用微软预览服务
            const absoluteUrl = encodeURIComponent(new URL(rawPath, window.location.href).href);
            const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${absoluteUrl}`;
            modalBody.innerHTML = `<iframe src="${officeViewerUrl}" width="100%" height="80vh" style="border: none; background: white;"></iframe>`;
        }
    } 
    // 4. 其他未知格式
    else {
        modalBody.innerHTML = `<div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">暂不支持预览该格式的文件。</div>`;
    }
}

// 关闭弹窗
function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = ''; // 清空内容，防止视频/音频等继续在后台播放或占用内存
}

// 点击弹窗的黑色半透明背景处，也能自动关闭弹窗
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// 保留原有的黑夜模式切换
document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
}

// 保留原有的粒子特效
tsParticles.load("particles", {
    particles: {
        number: { value: 80 },
        size: { value: 2 },
        move: { speed: 1 },
        links: { enable: true }
    }
});