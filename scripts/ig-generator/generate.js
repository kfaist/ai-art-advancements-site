/**
 * Instagram Carousel Generator with Smart Variety Tracking
 * Features:
 * - Headlines every 2-3 slides (grid-legible)
 * - Max 3 people images consecutively
 * - Alternates nonprofit/art content
 * - Zapier webhook integration ready
 */

const fs = require('fs').promises;
const path = require('path');

class CarouselGenerator {
    constructor() {
        this.tracker = {
            peopleCount: 0,
            lastType: null,
            slidesSinceHeadline: 0
        };
    }

    // Generate prompt based on variety needs
    getImagePrompt(index) {
        const needsHeadline = this.tracker.slidesSinceHeadline >= 2;
        const avoidPeople = this.tracker.peopleCount >= 3;
        const isNonprofit = this.tracker.lastType !== 'nonprofit';
        
        let prompt = isNonprofit ? 
            "Digital art showcasing nonprofit technology impact, " :
            "Futuristic AI art creation, ";
            
        if (avoidPeople) {
            prompt += "abstract patterns, no humans, geometric shapes, ";
            this.tracker.peopleCount = 0;
        } else {
            prompt += Math.random() > 0.5 ? "featuring diverse people, " : "abstract visualization, ";
            this.tracker.peopleCount++;
        }
        
        if (needsHeadline) {
            prompt += "with BOLD GLOWING TEXT overlay centered, high contrast, ";
            this.tracker.slidesSinceHeadline = 0;
        } else {
            this.tracker.slidesSinceHeadline++;
        }
        
        prompt += "vibrant colors, Instagram square 1080x1080, professional quality";
        
        this.tracker.lastType = isNonprofit ? 'nonprofit' : 'art';
        return prompt;
    }

    // Generate headline text (short for grid visibility)
    getHeadlineText(index) {
        const headlines = [
            "AI CREATES",
            "TECH FOR GOOD",
            "FUTURE NOW",
            "ART EVOLVES",
            "IMPACT DAILY",
            "INNOVATE",
            "TRANSFORM"
        ];
        return headlines[index % headlines.length];
    }

    async generateCarousel(count = 10) {
        const carousel = [];
        
        for (let i = 0; i < count; i++) {
            const needsHeadline = this.tracker.slidesSinceHeadline >= 2;
            
            carousel.push({
                index: i,
                prompt: this.getImagePrompt(i),
                headline: needsHeadline ? this.getHeadlineText(i) : null,
                type: this.tracker.lastType,
                metadata: {
                    hasPeople: this.tracker.peopleCount > 0,
                    hasHeadline: needsHeadline,
                    contentType: this.tracker.lastType,
                    timestamp: new Date().toISOString()
                }
            });
        }
        
        // Save for Zapier webhook
        await fs.writeFile(
            path.join(__dirname, '../../content/carousel-data.json'),
            JSON.stringify(carousel, null, 2)
        );
        
        console.log(`✅ Generated ${count} slide carousel with variety tracking`);
        console.log(`📊 Mix: ${carousel.filter(s => s.type === 'nonprofit').length} nonprofit, ${carousel.filter(s => s.type === 'art').length} art`);
        console.log(`👥 People slides: ${carousel.filter(s => s.metadata.hasPeople).length}`);
        console.log(`📝 Headlines: ${carousel.filter(s => s.metadata.hasHeadline).length}`);
        
        return carousel;
    }
}

// Export for use
module.exports = CarouselGenerator;

// Run if called directly
if (require.main === module) {
    const generator = new CarouselGenerator();
    generator.generateCarousel(10).then(() => {
        console.log('🎨 Carousel data ready for Zapier webhook!');
    }).catch(console.error);
}