function initPhone() {
  // ==========================================
  // 0. 热更新清理（极其重要！）
  // 每次保存代码时，先删掉旧的手机和按钮，防止出现重影
  // ==========================================
  const oldPhone = document.getElementById('my-virtual-phone');
  if (oldPhone) oldPhone.remove();

  const oldBtn = document.getElementById('my-phone-btn');
  if (oldBtn) oldBtn.remove();

  // ==========================================
  // 1. 创建手机的外层容器
  // ==========================================
  const phoneContainer = document.createElement('div');
  phoneContainer.id = 'my-virtual-phone';

  // 2. 用 CSS 给它画一个手机的形状
  phoneContainer.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 320px;
    height: 600px;
    background-color: #f3f3f3;
    border-radius: 30px;
    border: 8px solid #333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    z-index: 9999;
    display: none; /* 默认隐藏，点按钮才出来 */
    overflow: hidden;
    flex-direction: column;
  `;

  // 3. 往手机里塞内容
  phoneContainer.innerHTML = `
    <div style="background: #333; color: white; text-align: center; padding: 5px; font-size: 12px;">15:20 | 5G 🔋94%</div>
    <div style="flex: 1; padding: 20px; text-align: center;">
        <h2 style="color: #333;">我的智能手机</h2>
        <button id="btn-message" style="padding: 10px; margin: 10px; border-radius: 10px; cursor: pointer;">短信 App</button>
        <button id="btn-photo" style="padding: 10px; margin: 10px; border-radius: 10px; cursor: pointer;">相册 App</button>
    </div>
  `;

  // 4. 挂载手机
  if (document.body) {
    document.body.appendChild(phoneContainer);
    console.log('[Phone] phoneContainer added to body');
  } else {
    console.error('[Phone] document.body is not available');
  }

  // ==========================================
  // 5. 创建开关按钮
  // ==========================================
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'my-phone-btn'; // 给按钮加上ID，方便上面第0步进行清理
  toggleBtn.innerText = "📱";
  toggleBtn.style.cssText = `
    position: fixed; 
    right: 20px; 
    bottom: 100px; 
    z-index: 9999; 
    width: 60px;
    height: 60px;
    background: #0084ff; 
    color: white; 
    border-radius: 50%;
    border: none;
    cursor: grab;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  `;

  // 拖动功能
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  toggleBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - toggleBtn.getBoundingClientRect().left;
    offsetY = e.clientY - toggleBtn.getBoundingClientRect().top;
    toggleBtn.style.cursor = 'grabbing';
    toggleBtn.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      toggleBtn.style.right = 'auto';
      toggleBtn.style.bottom = 'auto';
      toggleBtn.style.left = x + 'px';
      toggleBtn.style.top = y + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    toggleBtn.style.cursor = 'grab';
    toggleBtn.style.transition = 'all 0.3s ease';
  });

  // 6. 点击按钮切换手机显示状态
  toggleBtn.addEventListener('click', (e) => {
    if (!isDragging) {
      if (phoneContainer.style.display === 'none') {
        phoneContainer.style.display = 'flex';
      } else {
        phoneContainer.style.display = 'none';
      }
    }
  });

  // 悬停效果
  toggleBtn.addEventListener('mouseenter', () => {
    if (!isDragging) {
      toggleBtn.style.transform = 'scale(1.1)';
      toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    }
  });

  toggleBtn.addEventListener('mouseleave', () => {
    if (!isDragging) {
      toggleBtn.style.transform = 'scale(1)';
      toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }
  });

  document.body.appendChild(toggleBtn);
  console.log('[Phone] toggleBtn added to body');
}

$(() => {
  initPhone();
  toastr.success('小手机已加载成功！', '📱');
});
