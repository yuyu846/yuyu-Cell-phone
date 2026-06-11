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

  // 4. 挂载手机（使用 jQuery 方式确保在酒馆中正确显示）
  $(phoneContainer).appendTo('body');
  console.log('[Phone] phoneContainer added to body');

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

  // 拖动功能（支持鼠标与触摸，区分拖动与点击，保存位置）
  let isDragging = false;
  let startX = 0, startY = 0;
  let btnStartLeft = 0, btnStartTop = 0;
  let moved = false;
  const DRAG_THRESHOLD = 6; // px

  // 从 localStorage 恢复上次的位置（如果有）
  const savedLeft = localStorage.getItem('my-phone-btn-left');
  const savedTop = localStorage.getItem('my-phone-btn-top');
  if (savedLeft !== null && savedTop !== null) {
    toggleBtn.style.right = 'auto';
    toggleBtn.style.bottom = 'auto';
    toggleBtn.style.left = parseInt(savedLeft, 10) + 'px';
    toggleBtn.style.top = parseInt(savedTop, 10) + 'px';
  }

  // 防止触摸拖动时页面滚动
  toggleBtn.style.touchAction = 'none';

  toggleBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { toggleBtn.setPointerCapture(e.pointerId); } catch (err) {}
    isDragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = toggleBtn.getBoundingClientRect();
    btnStartLeft = rect.left;
    btnStartTop = rect.top;
    toggleBtn.style.transition = 'none';
    toggleBtn.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) moved = true;
    if (moved) {
      let newLeft = btnStartLeft + dx;
      let newTop = btnStartTop + dy;
      const btnW = toggleBtn.offsetWidth;
      const btnH = toggleBtn.offsetHeight;
      const maxLeft = window.innerWidth - btnW;
      const maxTop = window.innerHeight - btnH;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));
      toggleBtn.style.right = 'auto';
      toggleBtn.style.bottom = 'auto';
      toggleBtn.style.left = newLeft + 'px';
      toggleBtn.style.top = newTop + 'px';
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { toggleBtn.releasePointerCapture(e.pointerId); } catch (err) {}
    toggleBtn.style.transition = 'all 0.3s ease';
    toggleBtn.style.cursor = 'grab';
    if (moved) {
      const leftVal = parseFloat(toggleBtn.style.left || toggleBtn.getBoundingClientRect().left);
      const topVal = parseFloat(toggleBtn.style.top || toggleBtn.getBoundingClientRect().top);
      localStorage.setItem('my-phone-btn-left', Math.round(leftVal));
      localStorage.setItem('my-phone-btn-top', Math.round(topVal));
      // 标记刚刚拖动过，短时间内屏蔽 click
      toggleBtn._justDragged = true;
      setTimeout(() => { toggleBtn._justDragged = false; }, 200);
    }
  });

  // 6. 点击按钮切换手机显示状态
  toggleBtn.addEventListener('click', (e) => {
    // 如果刚拖动过，忽略 click
    if (toggleBtn._justDragged) return;
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

  // 使用 jQuery 方式添加按钮
  $(toggleBtn).appendTo('body');
  console.log('[Phone] toggleBtn added to body');
}

$(() => {
  initPhone();
  toastr.success('小手机已加载成功！', '📱');
});
