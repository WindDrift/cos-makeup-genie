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
    const locExhibition = document.getElementById('loc-exhibition');
    const locCustom = document.getElementById('loc-custom');
    const customLocation = document.getElementById('customLocation');
    const customLocationContainer = document.getElementById('customLocationContainer');
    const hour = document.getElementById('hour');
    const minute = document.getElementById('minute');
    const timeFlexible = document.getElementById('time-flexible');
    const location = document.getElementById('location');
    const budgetMin = document.getElementById('budgetMin');
    const budgetMax = document.getElementById('budgetMax');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const copyBtn = document.getElementById('copyBtn');

    // 设置默认日期为当前日期
    const today = new Date();
    year.value = today.getFullYear();
    month.value = today.getMonth() + 1;  // getMonth() 返回 0-11
    day.value = today.getDate();

    // 清空表单内容但不删除存储的数据
    function clearFormOnly() {
        // 清空所有文本输入
        document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        // 取消所有单选按钮选择
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // 重置展会地点选项状态
        locExhibition.disabled = true;
        
        // 隐藏自定义地点输入框
        customLocationContainer.style.display = 'none';
        
        // 清空输出区域
        outputArea.textContent = '这里将显示生成的文案...';
        
        // 重置日期为当前日期
        year.value = today.getFullYear();
        month.value = today.getMonth() + 1;
        day.value = today.getDate();
    }

    // 清空内容按钮的点击处理函数
    function handleClearContent() {
        if (confirm('确定要清空已填内容吗？（不会删除保存的数据）')) {
            clearFormOnly();
            return true;
        }
        return false;
    }

    // 完全清空按钮的点击处理函数
    function handleClearAll() {
        if (confirm('确定要清空所有内容并删除保存的数据吗？此操作不可恢复。')) {
            localStorage.removeItem('cosFormData');
            clearFormOnly();
            return true;
        }
        return false;
    }

    // 从 localStorage 恢复数据
    function restoreFromStorage() {
        const savedData = localStorage.getItem('cosFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // 显示恢复提示弹窗
            const dialog = document.getElementById('restoreDialog');
            dialog.style.display = 'flex';
            
            // 处理弹窗按钮点击
            document.getElementById('dialogCompleteBtn').onclick = function() {
                dialog.style.display = 'none';
            };
            
            document.getElementById('dialogClearBtn').onclick = function() {
                if (handleClearContent()) {
                    dialog.style.display = 'none';
                }
            };
            
            document.getElementById('dialogClearAllBtn').onclick = function() {
                if (handleClearAll()) {
                    dialog.style.display = 'none';
                }
            };
            
            // 恢复文本输入
            cn.value = data.cn || '';
            ip.value = data.ip || '';
            role.value = data.role || '';
            exhibition.value = data.exhibition || '';
            budgetMin.value = data.budgetMin || '';
            budgetMax.value = data.budgetMax || '';
            customLocation.value = data.customLocation || '';
            
            // 恢复日期
            year.value = data.year || today.getFullYear();
            month.value = data.month || (today.getMonth() + 1);
            day.value = data.day || today.getDate();
            
            // 恢复时间值
            hour.value = data.hour || '';
            minute.value = data.minute || '';
            timeFlexible.checked = data.timeFlexible || false;
            hour.disabled = timeFlexible.checked;
            minute.disabled = timeFlexible.checked;
            
            // 恢复单选按钮
            if (data.gender) {
                document.querySelector(`input[name="gender"][value="${data.gender}"]`).checked = true;
            }
            if (data.locationType) {
                const locationEl = document.querySelector(`input[name="locationType"][value="${data.locationType}"]`);
                if (locationEl) {
                    locationEl.checked = true;
                    if (data.locationType === '指定地点') {
                        customLocationContainer.style.display = 'block';
                    }
                }
            }
            if (data.contactLens) {
                document.querySelector(`input[name="contactLens"][value="${data.contactLens}"]`).checked = true;
            }

            // 更新展会地点选项状态
            locExhibition.disabled = !exhibition.value.trim();
        }
    }

    // 保存数据到 localStorage
    function saveToStorage() {
        const data = {
            cn: cn.value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            ip: ip.value,
            role: role.value,
            year: year.value,
            month: month.value,
            day: day.value,
            exhibition: exhibition.value,
            locationType: document.querySelector('input[name="locationType"]:checked')?.value,
            customLocation: customLocation.value,
            hour: hour.value,
            minute: minute.value,
            budgetMin: budgetMin.value,
            budgetMax: budgetMax.value,
            contactLens: document.querySelector('input[name="contactLens"]:checked')?.value,
            timeFlexible: timeFlexible.checked
        };
        localStorage.setItem('cosFormData', JSON.stringify(data));
    }

    // 添加输入事件监听器
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', saveToStorage);
        input.addEventListener('input', saveToStorage);
    });

    // 页面加载时恢复数据
    restoreFromStorage();

    // 监听展会名称变化
    exhibition.addEventListener('input', function() {
        locExhibition.disabled = !this.value.trim();
        if (!this.value.trim() && locExhibition.checked) {
            locExhibition.checked = false;
        }
    });

    // 监听地点类型选择
    document.querySelectorAll('input[name="locationType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            customLocationContainer.style.display = 
                this.id === 'loc-custom' ? 'block' : 'none';
        });
    });

    // 添加时间复选框变化监听
    timeFlexible.addEventListener('change', function() {
        hour.disabled = this.checked;
        minute.disabled = this.checked;
        if (this.checked) {
            hour.value = '';
            minute.value = '';
        }
    });

    // 删除原有的 generateBtn 相关代码和事件监听器

    // 修改复制按钮的事件监听器
    copyBtn.addEventListener('click', async function() {
        // 获取所有输入值并去除首尾空格
        const locationType = document.querySelector('input[name="locationType"]:checked');
        const values = {
            cn: cn.value.trim(),
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            ip: ip.value.trim(),
            role: role.value.trim(),
            date: `${year.value || ''}年${month.value || ''}月${day.value || ''}日`,
            exhibition: exhibition.value.trim(),
            time: timeFlexible.checked ? 
                '接受妆娘指定' : 
                (hour.value && minute.value ? 
                    `${hour.value.padStart(2, '0')}:${minute.value.padStart(2, '0')}` : 
                    ''),
            location: locationType ? 
                (locationType.value === '指定地点' ? 
                    `${locationType.value}：${customLocation.value.trim()}` : 
                    locationType.value) : 
                '',
            budget: (budgetMin.value || budgetMax.value) ? 
                `${budgetMin.value || ''}${budgetMin.value && budgetMax.value ? '~' : ''}${budgetMax.value || ''}元` : '',
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
        outputArea.textContent = generatedText;

        // 复制到剪贴板
        try {
            await navigator.clipboard.writeText(generatedText);
            this.textContent = '已复制！';
            this.classList.add('success');
            
            // 2秒后恢复原始状态
            setTimeout(() => {
                this.textContent = '生成并复制文案';
                this.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        }
    });

    // 按钮状态管理
    function handleButtonAction(button, originalText, confirmText, action) {
        if (button.dataset.confirming === 'true') {
            // 执行操作
            action();
            
            // 显示完成状态
            button.textContent = '已完成';
            button.disabled = true;
            
            // 2秒后恢复原始状态
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.dataset.confirming = 'false';
            }, 2000);
        } else {
            // 设置确认状态
            button.textContent = confirmText;
            button.dataset.confirming = 'true';
            
            // 5秒后如果没有确认，恢复原始状态
            setTimeout(() => {
                if (button.dataset.confirming === 'true') {
                    button.textContent = originalText;
                    button.dataset.confirming = 'false';
                }
            }, 5000);
        }
    }

    // 替换原有的按钮事件处理程序
    document.getElementById('clearBtn').addEventListener('click', function() {
        handleButtonAction(
            this,
            '清空已填内容',
            '再次点击以确认清空',
            () => clearFormOnly()
        );
    });

    document.getElementById('clearAllBtn').addEventListener('click', function() {
        handleButtonAction(
            this,
            '清空内容并删除数据',
            '再次点击以确认删除所有数据',
            () => {
                localStorage.removeItem('cosFormData');
                clearFormOnly();
            }
        );
    });

    document.getElementById('restoreBtn').addEventListener('click', function() {
        const savedData = localStorage.getItem('cosFormData');
        handleButtonAction(
            this,
            '恢复已填内容',
            savedData ? '再次点击以确认恢复' : '没有已保存的数据',
            () => {
                if (savedData) {
                    restoreFromStorage();
                }
            }
        );
    });
});
