<template>
    <div class="container" id="mainContainer">
        <!-- 表单区域 -->
        <div id="formContainer">
            <h2>📦 三角洲账户资产快照(多选皮肤)</h2>
            <form id="assetForm">
                <div class="form-grid" style="color:#fff">
                    <!-- 哈弗比 & 三角币 -->
                    <div>
                        <label>总资产：</label>
                        <!-- <input type="number" id="hafubi" min="0" step="1" value="0" placeholder="0"> -->
                        <input v-model="AllValue" min="0" @focus="handleFocus" class="dark-input"
                            controls-position="right" /> M
                    </div>
                    <div>
                        <label>流动资产：</label>
                        <input v-model="currentAssets" min="0" @focus="handleFocus" class="dark-input"
                            controls-position="right" /> M
                    </div>
                    <div>
                        <label>固定资产：</label>
                        <input v-model="fixedAssets" min="0" @focus="handleFocus" class="dark-input"
                            controls-position="right" /> M
                    </div>
                    <div>
                        <label>三角币：</label>
                        <input type="number" id="coupon" min="0" step="1" v-model="sanjiaobi" placeholder="0"
                            class="dark-input">
                    </div>


                    <!-- 二次实名选项 -->
                    <!-- <div class="form-item">
                        <label class="form-label">是否可二次：</label>
                        <el-radio-group v-model="iftowChange">
                            <el-radio value="可二次实名">可二次实名</el-radio>
                            <el-radio value="不可二次实名">不可二次实名</el-radio>
                        </el-radio-group>
                    </div> -->


                    <!-- 刀皮多选(全宽，因为选项较多) -->
                    <div class="full-width category-box">
                        <h3>🔪 刀皮 (勾选拥有的)</h3>
                        <div class="checkbox-group" id="knifeCheckboxGroup">
                            <el-checkbox-group v-model="knifeList" class="checkbox-group">
                                <div v-for="(p, index) in knifeArr" :key="p.name" class="checkbox-item">
                                    <el-image :src="p.picUrl" fit="contain"
                                        @click.native="knifeList = toggleItem(knifeList, p.name)" />
                                    <el-checkbox :value="p.name" size="large">{{ p.name }}</el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>

                    <!-- 人物皮肤多选 -->
                    <div class="full-width category-box">
                        <h3>🧑 人物皮肤 (勾选拥有的)</h3>
                        <div class="checkbox-group" id="characterCheckboxGroup">
                            <el-checkbox-group v-model="charaterList" class="checkbox-group">
                                <div v-for="(p, index) in manArr" :key="p.name" class="checkbox-item">
                                    <el-image :src="p.picUrl" fit="contain"
                                        @click.native="charaterList = toggleItem(charaterList, p.name)" />
                                    <el-checkbox :value="p.name" size="large">{{ p.name }}</el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <!-- 枪械皮肤多选 -->
                    <div class="full-width category-box">
                        <h3>🔫 枪械皮肤 (勾选拥有的)</h3>
                        <div class="checkbox-group" id="gunCheckboxGroup" v-for="weaponGroup in weaponArr">
                            <h4>{{ weaponGroup[0] }}</h4>
                            <el-checkbox-group v-model="gunList" class="checkbox-group">
                                <div v-for="(p, index) in weaponGroup" :key="p" class="checkbox-item">

                                    <el-checkbox :value="p" size="large">{{ p }}</el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <!-- 结果区域(初始隐藏) -->
        <div id="resultContainer">
            <text id="assetText">{{ Txtopt }}</text>
            <button class="return-btn" id="copyButton" @click="copyText">复制文本</button>
            <button class="return-btn" id="returnBtn" @click="resetHandle">⟲ 重置</button>
        </div>
        
        <!-- 回到顶部组件 -->
    </div>
    <el-backtop :visibility-height="300" />
</template>
<script setup>
import { ref, reactive, computed } from 'vue';
const AllValue = ref(0) // 总资产
const currentAssets = ref(0) // 流动资产
const fixedAssets = ref(0) // 固定资产
const sanjiaobi = ref(0) // 三角币
const iftowChange = ref('可二次实名') // 单选框值
const knifeList = ref([]) // 选中武器列表
const charaterList = ref([]) // 选中人物列表
const gunList = ref([]) // 选中枪皮列表

const knifeArr = ref([
    { name: '近战武器-暗星', name1: '近战-暗星', price: 320, picUrl: new URL('@/assets/images/knife/anxing.png', import.meta.url).href },
    { name: '近战武器-北极星', name1: '近战-北极星', price: 610, picUrl: new URL('@/assets/images/knife/beijixing.png', import.meta.url).href },
    { name: '近战武器-信条', name1: '近战-信条', price: 350, picUrl: new URL('@/assets/images/knife/xintiao.png', import.meta.url).href },
    { name: '近战武器-黑海', name1: '近战-黑海', price: 500, picUrl: new URL('@/assets/images/knife/heihai.png', import.meta.url).href },
    { name: '近战武器-影锋', name1: '近战-影锋', price: 420, picUrl: new URL('@/assets/images/knife/yingfeng.png', import.meta.url).href },
    { name: '近战武器-怜悯', name1: '近战-怜悯', price: 380, picUrl: new URL('@/assets/images/knife/lianmin.png', import.meta.url).href },
    { name: '近战武器-龙牙', name1: '近战-龙牙', price: 280, picUrl: new URL('@/assets/images/knife/longya.png', import.meta.url).href },
    { name: '近战武器-赤枭', name1: '近战-赤枭', price: 420, picUrl: new URL('@/assets/images/knife/chixiao.png', import.meta.url).href },
    { name: '近战武器-电锯惊魂', name1: '近战-电锯惊魂', price: 100, picUrl: new URL('@/assets/images/knife/dianju.png', import.meta.url).href },
    { name: '近战武器-坠星者', name1: '近战-坠星者', price: 600, picUrl: new URL('@/assets/images/knife/zhuixingzhe.png', import.meta.url).href },
    { name: '近战武器-尼泊尔-挽歌', name1: '近战-尼泊尔-挽歌', price: 600, picUrl: new URL('@/assets/images/knife/niboer.png', import.meta.url).href },
])
const manArr = ref([
    { name: '威龙凌霄戍卫', name1: '威龙-凌霄戍卫', price: 350, flag: 1, ifLink: 0, ifCom: 1, picUrl: new URL('@/assets/images/Character/weilong1.png', import.meta.url).href },
    { name: '红狼蚀金玫瑰', name1: '红狼-蚀金玫瑰', price: 320, flag: 1, ifLink: 0, ifCom: 1, picUrl: new URL('@/assets/images/Character/honglang1.jpg', import.meta.url).href },
    { name: '露娜黑天际线', name1: '露娜-黑·天际线', price: 200, flag: 1, ifLink: 1, ifCom: 0, picUrl: new URL('@/assets/images/Character/luna1.jpg', import.meta.url).href },
    { name: '骇爪水墨云图', name1: '骇爪-水墨云图', price: 260, flag: 1, ifLink: 0, ifCom: 1, picUrl:new URL('@/assets/images/Character/haizhua1.jpg', import.meta.url).href },
    { name: '骇爪维什戴尔', name1: '骇爪-维什戴尔', price: 120, flag: 1, ifLink: 1, ifCom: 0, picUrl: new URL('@/assets/images/Character/haizhua1.png', import.meta.url).href },
    { name: '盅能天使午夜邮差', name1: '盅-能天使午夜邮差', price: 200, flag: 1, ifLink: 1, ifCom: 0, picUrl: new URL('@/assets/images/Character/gu1.jpg', import.meta.url).href },
    { name: '威龙飞虎', name1: '威龙-飞虎', price: 350, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/weilong2.png', import.meta.url).href },
    { name: '露娜劳拉克劳馥', name1: '露娜劳拉克劳馥', price: 140, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/laola.png', import.meta.url).href },
    // { name: '威龙蛟龙特战队', name1: '威龙-蛟龙特战队', price: 200, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/jiaolong.png', import.meta.url).href },
    // { name: '威龙壮志凌云', name1: '威龙-壮志凌云', price: 100, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/weilong1.png', import.meta.url).href },
    // { name: '威龙铁面判官', name1: '威龙-铁面判官', price: 100, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/tiemianpanguan.png', import.meta.url).href },
    // { name: '蜂医送葬人无题密令', name1: '蜂医-送葬人·无题密令', price: 30, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/fengyi1.png', import.meta.url).href },
    // { name: '蜂医危险物质', name1: '峰医-危险物质', price: 300, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/weixianwuzhi.png', import.meta.url).href },
    // { name: '无名夜鹰', name1: '无名-夜鹰', price: 20, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/wuming1.png', import.meta.url).href },
    // { name: '露娜金牌射手', name1: '露娜-金牌射手', price: 10, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/luna1.png', import.meta.url).href },
    // { name: '红狼电锯惊魂', name1: '红狼-电锯惊魂', price: 10, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/honglang1.png', import.meta.url).href },
    // { name: '牧羊人街头之王', name1: '牧羊人-街头之王', price: 20, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/muyangren1.png', import.meta.url).href },
    // { name: '深蓝不破誓约', name1: '深蓝-不破誓约', price: 20, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/bupozhishi.png', import.meta.url).href },
    // { name: '盅-不羁人生', name1: '盅-不羁人生', price: 10, flag: 0, ifLink: 0, ifCom: 0, picUrl: new URL('@/assets/images/Character/gu1.png', import.meta.url).href },
])
const weaponArr = reactive(
    {
        "AKM突击步枪-群星": ["AKM突击步枪-群星(极品S)", "AKM突击步枪-群星(极品A)", "AKM突击步枪-群星(极品B)", "AKM突击步枪-群星(极品C)", "AKM突击步枪-群星(优品S)", "AKM突击步枪-群星(优品A)", "AKM突击步枪-群星(优品B)", "AKM突击步枪-群星(优品C)"],
        "M7系列": ["M7战斗步枪-棱镜攻势S2(极品S)", "M7战斗步枪-棱镜攻势S2(极品A)", "M7战斗步枪-棱镜攻势S2(极品B)", "M7战斗步枪-棱镜攻势S2(极品C)", "M7战斗步枪-棱镜攻势S2(优品S)", "M7战斗步枪-棱镜攻势S2(优品A)", "M7战斗步枪-棱镜攻势S2(优品B)", "M7战斗步枪-棱镜攻势S2(优品C)"],
        "M4A1突击步枪-棱镜攻势": ["M4A1突击步枪-棱镜攻势(极品S)", "M4A1突击步枪-棱镜攻势(极品A)", "M4A1突击步枪-棱镜攻势(极品B)", "M4A1突击步枪-棱镜攻势(优品S)", "M4A1突击步枪-棱镜攻势(优品A)", "M4A1突击步枪-棱镜攻势(优品B)", "M4A1突击步枪-棱镜攻势(优品C)"],
        "MP7冲锋枪-电玩高手S2": ["MP7冲锋枪-电玩高手S2(极品S)", "MP7冲锋枪-电玩高手S2(极品A)", "MP7冲锋枪-电玩高手S2(极品B)", "MP7冲锋枪-电玩高手S2(优品S)", "MP7冲锋枪-电玩高手S2(优品A)", "MP7冲锋枪-电玩高手S2(优品B)", "MP7冲锋枪-电玩高手S2(优品C)"],
        "KC17突击步枪-造物纪元": ["KC17突击步枪-造物纪元(极品S)", "KC17突击步枪-造物纪元(极品A)", "KC17突击步枪-造物纪元(极品B)", "KC17突击步枪-造物纪元(优品S)", "KC17突击步枪-造物纪元(优品A)", "KC17突击步枪-造物纪元(优品B)", "KC17突击步枪-造物纪元(优品C)"],
        "SCAR-H战斗步枪-电玩高手": ["SCAR-H战斗步枪-电玩高手(极品S)", "SCAR-H战斗步枪-电玩高手(极品A)", "SCAR-H战斗步枪-电玩高手(极品B)", "SCAR-H战斗步枪-电玩高手(优品S)", "SCAR-H战斗步枪-电玩高手(优品A)", "SCAR-H战斗步枪-电玩高手(优品B)", "SCAR-H战斗步枪-电玩高手(优品C)"],
        "Vector冲锋枪-美杜莎": ["Vector冲锋枪-美杜莎(极品S)", "Vector冲锋枪-美杜莎(极品A)", "Vector冲锋枪-美杜莎(极品B)", "Vector冲锋枪-美杜莎(优品S)", "Vector冲锋枪-美杜莎(优品A)", "Vector冲锋枪-美杜莎(优品B)", "Vector冲锋枪-美杜莎(优品C)"],
        "K416突击步枪-命运": ["K416突击步枪-命运(极品S)", "K416突击步枪-命运(极品A)", "K416突击步枪-命运(极品B)", "K416突击步枪-命运(优品S)", "K416突击步枪-命运(优品A)", "K416突击步枪-命运(优品B)", "K416突击步枪-命运(优品C)"],
        "QBZ95-1突击步枪-王牌之剑": ["QBZ95-1突击步枪-王牌之剑(极品S)", "QBZ95-1突击步枪-王牌之剑(极品A)", "QBZ95-1突击步枪-王牌之剑(极品B)", "QBZ95-1突击步枪-王牌之剑(优品S)", "QBZ95-1突击步枪-王牌之剑(优品A)", "QBZ95-1突击步枪-王牌之剑(优品B)", "QBZ95-1突击步枪-王牌之剑(优品C)"],
        "AUG突击步枪-气象感应": ["AUG突击步枪-气象感应(极品S)", "AUG突击步枪-气象感应(极品A)", "AUG突击步枪-气象感应(极品B)", "AUG突击步枪-气象感应(优品S)", "AUG突击步枪-气象感应(优品A)", "AUG突击步枪-气象感应(优品B)", "AUG突击步枪-气象感应(优品C)"],
        "腾龙突击步枪-气象感应": ["腾龙突击步枪-气象感应(极品S)", "腾龙突击步枪-气象感应(极品A)", "腾龙突击步枪-气象感应(极品B)", "腾龙突击步枪-气象感应(优品S)", "腾龙突击步枪-气象感应(优品A)", "腾龙突击步枪-气象感应(优品B)", "腾龙突击步枪-气象感应(优品C)"],
        "ASVal突击步枪-悬赏令": ["ASVal突击步枪-悬赏令(极品S)", "ASVal突击步枪-悬赏令(极品A)", "ASVal突击步枪-悬赏令(极品B)", "ASVal突击步枪-悬赏令(优品S)", "ASVal突击步枪-悬赏令(优品A)", "ASVal突击步枪-悬赏令(优品B)", "ASVal突击步枪-悬赏令(优品C)"],
        "250通用机枪-电玩高手S2": ["250通用机枪-电玩高手S2(极品S)", "250通用机枪-电玩高手S2(极品A)", "250通用机枪-电玩高手S2(极品B)", "250通用机枪-电玩高手S2(优品S)", "250通用机枪-电玩高手S2(优品A)", "250通用机枪-电玩高手S2(优品B)", "250通用机枪-电玩高手S2(优品C)"],
    }
)
// 输入框清空
const handleFocus = (e) => {
    // console.log(e.target.value);
    if (e.target.value === 0 || e.target.value === '0') {
        {
            e.target.value = ''
        }
    }
}

// 点击图片切换选中状态（核心方法）
const toggleItem = (list, skinName) => {
    // 判断当前皮肤是否已勾选
    const hasItem = list.includes(skinName)
    if (hasItem) {
        // 已存在：移除
        return list.filter(name => name !== skinName)
    } else {
        // 不存在：新增，保留原有全部勾选项
        return [...list, skinName]
    }
}

// 组合输出
const Txtopt = computed(() => {
    const knifeValue = knifeList.value.join(',')
    const charaterValue = charaterList.value.join(',')
    const gunValue = gunList.value.join(',')
    const textContent = `总资产：${AllValue.value}M，不动资产${fixedAssets.value}M，流动资产${currentAssets.value}M，【货币】${sanjiaobi.value}三角币，刀皮拥有:${knifeValue}，人物皮肤拥有:${charaterValue}，枪械皮肤拥有:${gunValue}`;
    return textContent
})
// 重置按钮
const resetHandle = () => {
    AllValue.value = 0 // 总资产
    currentAssets.value = 0 // 流动资产
    fixedAssets.value = 0 // 固定资产
    sanjiaobi.value = 0 // 三角币
    iftowChange.value = '可二次实名'// 单选框值
    knifeList.value = [] // 选中武器列表
    charaterList.value = [] // 选中人物列表
    gunList.value = [] // 选中枪皮列表

}
const copyText = async () => {
    try {
        await navigator.clipboard.writeText(Txtopt.value);
        alert("复制成功");
    } catch (e) {
        alert("复制失败，请手动复制");
    }
};
</script>
<style lang="css">
body {
    font-family: 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(145deg, #1b2a3a 0%, #0f1a24 100%);
    min-height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fffcfc;
}

.page {
    height: 100vh;
    overflow-y: auto;
}

/* 深色背景专用输入框 */
.dark-input {
    width: 200px;
    padding: 10px 15px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: #fff !important;
    outline: none;
    transition: all 0.3s ease;
}

.dark-input:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

.dark-input::placeholder {
    color: rgb(255, 252, 252);
}

.dark-input:hover {
    border-color: rgba(255, 255, 255, 0.3);
}

/* 去除数字输入框上下箭头 */
.dark-input::-webkit-outer-spin-button,
.dark-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.dark-input {
    -moz-appearance: textfield;
}

.container {
    background: rgba(20, 30, 40, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 32px;
    padding: 2.5rem;
    width: 90%;
    max-width: 800px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px #3a4e62 inset;
    border: 1px solid #5f7a93;
}

h2 {
    margin-top: 0;
    font-weight: 400;
    letter-spacing: 2px;
    border-bottom: 1px solid #3d5a73;
    padding-bottom: 12px;
    color: #bcd9e6;
    text-shadow: 0 2px 4px black;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.full-width {
    grid-column: span 2;
}

.category-box {
    background: #15232e;
    border-radius: 20px;
    padding: 1.2rem;
    border: 1px solid #2d4b5c;
}

.category-box h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #aad0f0;
    font-size: 1.1rem;
    border-left: 4px solid #4e8ca0;
    padding-left: 10px;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    margin-bottom: 1rem;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 120px;
}

.checkbox-item img {
    display: block;
    width: 50px;
    height: 50px;
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #4790aa;
    margin: 0;
}

.checkbox-item label {
    margin-bottom: 0;
    font-size: 1rem;
    color: #cbdbe9;
}

button {
    background: #2e5f6b;
    border: none;
    color: white;
    padding: 14px 28px;
    font-size: 1.2rem;
    border-radius: 40px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    letter-spacing: 1px;
    box-shadow: 0 8px 0 #1a3a44, 0 4px 12px rgba(0, 0, 0, 0.5);
    transition: 0.1s ease;
    margin-top: 2rem;
    border: 1px solid #4790aa;
}

button:hover {
    background: #3b7b8a;
    transform: translateY(-2px);
    box-shadow: 0 10px 0 #1a3a44, 0 6px 16px black;
}

button:active {
    transform: translateY(5px);
    box-shadow: 0 3px 0 #1a3a44, 0 4px 12px black;
}

#resultContainer {
    margin-top: 50px;
    text-align: center;
}

text {
    display: block;
    background: #0f1f28;
    border: 2px solid #3d738c;
    border-radius: 28px;
    padding: 2rem;
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    line-height: 1.8;
    color: #c9e9ff;
    white-space: pre-wrap;
    word-break: break-word;
    text-align: left;
    margin-bottom: 2rem;
    box-shadow: inset 0 0 20px rgba(0, 30, 40, 0.8);
}

.return-btn {
    background: #4f5e6b;
    box-shadow: 0 8px 0 #2f3e4a;
    border-color: #7b95a8;
}

.return-btn:hover {
    background: #657b8a;
}

.hidden {
    display: none;
}
</style>