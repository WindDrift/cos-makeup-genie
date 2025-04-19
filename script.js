// 等待 HTML 文档加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有输入元素
    const cn = document.getElementById('cn');
    const gender = document.getElementById('gender');
    const ip = document.getElementById('ip');
    const role = document.getElementById('role');
    const year = document.getElementById('year');
    const month = document.getElementById('month');
    const day = document.getElementById('day');
    const exhibition = document.getElementById('exhibition');
    const time = document.getElementById('time');
    const location = document.getElementById('location');
    const budget = document.getElementById('budget');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const copyBtn = document.getElementById('copyBtn');

    // 设置默认日期为当前日期
    const today = new Date();
    year.value = today.getFullYear();
    month.value = today.getMonth() + 1;  // getMonth() 返回 0-11
    day.value = today.getDate();

    generateBtn.addEventListener('click', function() {
        // 获取所有输入值并去除首尾空格
        const values = {
            cn: cn.value.trim(),
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            ip: ip.value.trim(),
            role: role.value.trim(),
            date: `${year.value || ''}年${month.value || ''}月${day.value || ''}日`,
            exhibition: exhibition.value.trim(),
            time: time.value.trim(),
            location: location.value.trim(),
            budget: budget.value.trim(),
            contactLens: document.querySelector('input[name="contactLens"]:checked')?.value || ''
        };

        // 检查是否所有输入框都为空
        if (Object.values(values).every(value => !value)) {
            outputArea.textContent = "请至少输入一个选项。";
            return;
        }

        // 生成文案
        let parts = [];

        if (values.cn) parts.push(`CN：${values.cn}`);
        if (values.gender) parts.push(`性别：${values.gender}`);
        if (values.ip) parts.push(`IP：${values.ip}`);
        if (values.role) parts.push(`角色：${values.role}`);
        if (values.date) parts.push(`日期：${values.date}`);
        if (values.exhibition) parts.push(`漫展：${values.exhibition}`);
        if (values.time) parts.push(`时间：${values.time}`);
        if (values.location) parts.push(`地点：${values.location}`);
        if (values.budget) parts.push(`预算：${values.budget}`);
        if (values.contactLens) parts.push(`戳瞳：${values.contactLens}`);

        // 使用 "/" 连接各个部分
        const generatedText = parts.join(' / ');

        // 显示生成的文案
        outputArea.textContent = generatedText;
    });

    // 添加复制按钮的事件监听器
    copyBtn.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(outputArea.textContent);
            
            // 视觉反馈
            copyBtn.textContent = '已复制！';
            copyBtn.classList.add('success');
            
            // 2秒后恢复原始状态
            setTimeout(() => {
                copyBtn.textContent = '复制文案';
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        }
    });
});
